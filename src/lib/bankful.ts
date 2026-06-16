const BASE_URL = process.env.BANKFUL_SANDBOX === "true"
  ? "https://api-dev1.bankfulportal.com"
  : "https://api.paybybankful.com";

const ENDPOINT = `${BASE_URL}/api/transaction/api`;

export type BankfulTransactionResponse = {
  REQUEST_ACTION: string;
  TRANS_STATUS_NAME: "APPROVED" | "DECLINED";
  TRANS_VALUE: string;
  TRANS_REQUEST_ID: string;
  TRANS_RECORD_ID: string;
  TRANS_ORDER_ID: string;
  XTL_ORDER_ID: string;
  TRANS_CUR: string;
  ERROR_MESSAGE?: string;
  API_ADVICE?: string;
  SERVICE_ADVICE?: string;
  PROCESSOR_ADVICE?: string;
};

export async function chargeCard(params: {
  amount: string;
  currency: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  orderId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  billingAddress?: {
    line1?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}): Promise<BankfulTransactionResponse> {
  const username = process.env.BANKFUL_USERNAME;
  const password = process.env.BANKFUL_PASSWORD;

  if (!username || !password) {
    throw new Error("Bankful credentials not configured");
  }

  const body = new URLSearchParams();
  body.append("req_username", username);
  body.append("req_password", password);
  body.append("transaction_type", "CAPTURE");
  body.append("amount", params.amount);
  body.append("request_currency", params.currency);
  body.append("pmt_numb", params.cardNumber);
  body.append("pmt_expiry", params.cardExpiry);
  body.append("pmt_key", params.cardCvv);
  body.append("xtl_order_id", params.orderId);

  if (params.firstName) body.append("cust_fname", params.firstName);
  if (params.lastName) body.append("cust_lname", params.lastName);
  if (params.email) body.append("cust_email", params.email);
  if (params.phone) body.append("cust_phone", params.phone);

  if (params.billingAddress) {
    if (params.billingAddress.line1) body.append("bill_addr", params.billingAddress.line1);
    if (params.billingAddress.city) body.append("bill_addr_city", params.billingAddress.city);
    if (params.billingAddress.state) body.append("bill_addr_state", params.billingAddress.state);
    if (params.billingAddress.zip) body.append("bill_addr_zip", params.billingAddress.zip);
    if (params.billingAddress.country) body.append("bill_addr_country", params.billingAddress.country);
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache",
    },
    body: body.toString(),
  });

  const text = await response.text();

  try {
    return JSON.parse(text) as BankfulTransactionResponse;
  } catch {
    throw new Error(`Bankful API returned non-JSON response: ${text}`);
  }
}

export async function refundTransaction(params: {
  amount: string;
  orderId: string;
}): Promise<BankfulTransactionResponse> {
  const username = process.env.BANKFUL_USERNAME;
  const password = process.env.BANKFUL_PASSWORD;

  if (!username || !password) {
    throw new Error("Bankful credentials not configured");
  }

  const body = new URLSearchParams();
  body.append("req_username", username);
  body.append("req_password", password);
  body.append("transaction_type", "REFUND");
  body.append("amount", params.amount);
  body.append("request_ref_po_id", params.orderId);

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache",
    },
    body: body.toString(),
  });

  const text = await response.text();

  try {
    return JSON.parse(text) as BankfulTransactionResponse;
  } catch {
    throw new Error(`Bankful API returned non-JSON response: ${text}`);
  }
}
