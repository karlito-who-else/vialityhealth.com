import type { PaymentAdapter } from "@payloadcms/plugin-ecommerce/types";
import { chargeCard } from "@/lib/bankful";

export const initiatePayment: (props?: Record<string, unknown>) => PaymentAdapter["initiatePayment"] =
  () => async ({ data, req, transactionsSlug }) => {
    const payload = req.payload;
    const cart = data.cart;
    const currency = data.currency;
    const customerEmail = data.customerEmail;
    const amount = cart.subtotal;

    const billingAddressFromData = data.billingAddress;
    const shippingAddressFromData = data.shippingAddress;

    if (!customerEmail) {
      throw new Error("Customer email is required");
    }

    if (!amount || amount <= 0) {
      throw new Error("Invalid cart total");
    }

    if (!cart?.id) {
      throw new Error("Cart not found");
    }

    const amountInDollars = (amount / 100).toFixed(2);

    const orderId = `cart_${cart.id}_${Date.now()}`;

    const extraData = data as Record<string, unknown>;
    const cardData = extraData.cardData as { cardNumber: string; cardExpiry: string; cardCvv: string; firstName?: string; lastName?: string } | undefined;

    if (!cardData?.cardNumber || !cardData?.cardExpiry || !cardData?.cardCvv) {
      throw new Error("Card details are required");
    }

    const bankfulResponse = await chargeCard({
      amount: amountInDollars,
      currency: currency?.toUpperCase() || "AUD",
      cardNumber: cardData.cardNumber,
      cardExpiry: cardData.cardExpiry,
      cardCvv: cardData.cardCvv,
      orderId,
      firstName: cardData.firstName,
      lastName: cardData.lastName,
      email: customerEmail,
      billingAddress: billingAddressFromData
        ? {
            line1: (billingAddressFromData as any).addressLine1 || undefined,
            city: (billingAddressFromData as any).city || undefined,
            state: (billingAddressFromData as any).state || undefined,
            zip: (billingAddressFromData as any).postalCode || undefined,
            country: (billingAddressFromData as any).country || undefined,
          }
        : undefined,
    });

    if (bankfulResponse.TRANS_STATUS_NAME !== "APPROVED") {
      const errorMsg =
        bankfulResponse.ERROR_MESSAGE ||
        bankfulResponse.PROCESSOR_ADVICE ||
        bankfulResponse.SERVICE_ADVICE ||
        "Payment was declined";
      throw new Error(errorMsg);
    }

    const flattenedCart = (cart.items || [])
      .filter((item: any) => item?.product)
      .map((item: any) => {
        const productID = typeof item.product === "object" ? item.product.id : item.product;
        const variantID =
          item.variant && typeof item.variant === "object" ? item.variant.id : item.variant;

        let price = item.product?.priceInAUD;
        if (variantID && item.variant && typeof item.variant === "object") {
          price = item.variant.priceInAUD;
        }

        return {
          product: productID,
          variant: variantID || undefined,
          quantity: item.quantity,
          price,
        };
      });

    const transaction = await payload.create({
      collection: transactionsSlug as "transactions",
      data: {
        customer: req.user?.id,
        amount,
        billingAddress: billingAddressFromData,
        cart: cart.id,
        currency: "AUD",
        items: flattenedCart,
        paymentMethod: "bankful",
        status: "succeeded",
        bankful: {
          transactionId: bankfulResponse.TRANS_ORDER_ID,
          requestId: bankfulResponse.TRANS_REQUEST_ID,
          recordId: bankfulResponse.TRANS_RECORD_ID,
          xtlOrderId: orderId,
        },
        ...(shippingAddressFromData
          ? { shippingAddress: shippingAddressFromData }
          : {}),
      } as any,
      req,
    });

    return {
      message: "Payment processed successfully",
      transactionId: transaction.id,
      bankfulOrderId: bankfulResponse.TRANS_ORDER_ID,
      xtlOrderId: orderId,
    };
  };
