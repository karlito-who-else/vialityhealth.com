import type { PaymentAdapter } from "@payloadcms/plugin-ecommerce/types";

export const confirmOrder: (props?: Record<string, unknown>) => PaymentAdapter["confirmOrder"] =
  () => async ({ cartsSlug = "carts", data, ordersSlug = "orders", req, transactionsSlug = "transactions" }) => {
    const payload = req.payload;
    const customerEmail = data.customerEmail;
    const transactionId = data.transactionId;

    if (!transactionId) {
      throw new Error("Transaction ID is required");
    }

    const { docs: transactions } = await payload.find({
      collection: transactionsSlug as "transactions",
      where: { id: { equals: transactionId } },
      depth: 1,
      req,
    });

    const transaction = transactions[0];
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    const cart = (transaction as any).cart;

    const order = await payload.create({
      collection: ordersSlug as "orders",
      data: {
        items: (transaction as any).items,
        shippingAddress: (transaction as any).shippingAddress,
        customer: req.user?.id,
        customerEmail: customerEmail || (transaction as any).customerEmail,
        amount: (transaction as any).amount,
        currency: (transaction as any).currency || "AUD",
        status: "completed",
        transactions: [transactionId],
      } as any,
      req,
    });

    if (cart) {
      try {
        await payload.update({
          collection: cartsSlug as "carts",
          id: typeof cart === "object" ? cart.id : cart,
          data: { purchasedAt: new Date().toISOString() } as any,
          req,
        });
      } catch (_err) {
        // non-critical
      }
    }

    try {
      await payload.update({
        collection: transactionsSlug as "transactions",
        id: transactionId,
        data: {
          order: order.id,
          status: "succeeded",
        } as any,
        req,
      });
    } catch (_err) {
      // non-critical
    }

    return {
      message: "Order confirmed successfully",
      orderID: order.id,
      transactionID: transactionId,
      ...((order as any).accessToken
        ? { accessToken: (order as any).accessToken }
        : {}),
    };
  };
