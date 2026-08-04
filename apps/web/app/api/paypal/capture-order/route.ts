import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
};

type PayPalEnvironment = "sandbox" | "live";

type CaptureOrderRequestBody = {
  orderId?: string;
};

type PayPalAccessTokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
};

type PayPalMoney = {
  currency_code?: string;
  value?: string;
};

type PayPalCapture = {
  id?: string;
  status?: string;
  amount?: PayPalMoney;
  final_capture?: boolean;
  seller_receivable_breakdown?: {
    gross_amount?: PayPalMoney;
    paypal_fee?: PayPalMoney;
    net_amount?: PayPalMoney;
  };
  create_time?: string;
  update_time?: string;
};

type PayPalPurchaseUnit = {
  reference_id?: string;
  custom_id?: string;
  invoice_id?: string;
  description?: string;
  amount?: PayPalMoney;
  payments?: {
    captures?: PayPalCapture[];
  };
};

type PayPalOrderResponse = {
  id?: string;
  status?: string;
  intent?: string;
  payer?: {
    payer_id?: string;
    email_address?: string;
    name?: {
      given_name?: string;
      surname?: string;
    };
  };
  payment_source?: {
    paypal?: {
      account_id?: string;
      email_address?: string;
      account_status?: string;
      name?: {
        given_name?: string;
        surname?: string;
      };
    };
  };
  purchase_units?: PayPalPurchaseUnit[];
  create_time?: string;
  update_time?: string;
  links?: Array<{
    href?: string;
    rel?: string;
    method?: string;
  }>;
};

type PayPalErrorResponse = {
  name?: string;
  message?: string;
  debug_id?: string;
  details?: Array<{
    issue?: string;
    description?: string;
    field?: string;
    value?: string;
  }>;
  links?: Array<{
    href?: string;
    rel?: string;
    method?: string;
  }>;
};

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
) {
  return NextResponse.json(body, {
    status,
    headers: NO_STORE_HEADERS,
  });
}

function requiredEnvironment() {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();
  const environmentValue =
    process.env.PAYPAL_ENVIRONMENT?.trim().toLowerCase();

  const environment: PayPalEnvironment =
    environmentValue === "sandbox" ? "sandbox" : "live";

  if (!clientId || !clientSecret) {
    return null;
  }

  const apiBase =
    environment === "sandbox"
      ? "https://api-m.sandbox.paypal.com"
      : "https://api-m.paypal.com";

  return {
    clientId,
    clientSecret,
    environment,
    apiBase,
  };
}

function isValidOrderId(value: string) {
  return /^[A-Z0-9]{1,36}$/.test(value);
}

function basicAuthorization(
  clientId: string,
  clientSecret: string,
) {
  return Buffer.from(
    `${clientId}:${clientSecret}`,
    "utf8",
  ).toString("base64");
}

async function parseResponseBody(response: Response) {
  const rawBody = await response.text();

  if (!rawBody) {
    return null;
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    return rawBody;
  }
}

function isPayPalErrorResponse(
  value: unknown,
): value is PayPalErrorResponse {
  return typeof value === "object" && value !== null;
}

function mapPayPalStatus(status: number) {
  if (status === 400) return 400;
  if (status === 401) return 502;
  if (status === 403) return 502;
  if (status === 404) return 404;
  if (status === 409) return 409;
  if (status === 422) return 409;
  if (status === 429) return 503;
  if (status >= 500) return 503;

  return 500;
}

function publicPayPalError(
  status: number,
  payload: unknown,
) {
  const paypalError = isPayPalErrorResponse(payload)
    ? payload
    : null;

  const issue =
    paypalError?.details?.[0]?.issue ?? null;

  if (
    issue === "ORDER_ALREADY_CAPTURED" ||
    issue === "ORDER_COMPLETED"
  ) {
    return {
      error: "PAYPAL_ORDER_ALREADY_CAPTURED",
      message:
        "This PayPal order has already been captured.",
    };
  }

  if (
    issue === "ORDER_NOT_APPROVED" ||
    issue === "PAYER_ACTION_REQUIRED"
  ) {
    return {
      error: "PAYPAL_ORDER_NOT_APPROVED",
      message:
        "The buyer must approve the PayPal order before it can be captured.",
    };
  }

  if (status === 400) {
    return {
      error: "PAYPAL_CAPTURE_REQUEST_INVALID",
      message:
        "PayPal rejected the capture request.",
    };
  }

  if (status === 404) {
    return {
      error: "PAYPAL_ORDER_NOT_FOUND",
      message:
        "The requested PayPal order was not found.",
    };
  }

  if (status === 409) {
    return {
      error: "PAYPAL_CAPTURE_BLOCKED",
      message:
        "PayPal could not capture this order in its current state.",
    };
  }

  if (status === 503) {
    return {
      error: "PAYPAL_CAPTURE_UNAVAILABLE",
      message:
        "PayPal capture is temporarily unavailable.",
    };
  }

  return {
    error: "PAYPAL_CAPTURE_FAILED",
    message:
      "The PayPal payment could not be captured.",
  };
}

async function getPayPalAccessToken(
  environment: NonNullable<
    ReturnType<typeof requiredEnvironment>
  >,
) {
  const response = await fetch(
    `${environment.apiBase}/v1/oauth2/token`,
    {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Basic ${basicAuthorization(
          environment.clientId,
          environment.clientSecret,
        )}`,
        Accept: "application/json",
        "Accept-Language": "en_US",
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    },
  );

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    console.error(
      "TA14_PAYPAL_ACCESS_TOKEN_ERROR",
      {
        upstreamStatus: response.status,
        environment: environment.environment,
        payload,
      },
    );

    throw new Error(
      "PayPal access token request failed.",
    );
  }

  const tokenPayload =
    payload as PayPalAccessTokenResponse;

  if (
    typeof tokenPayload.access_token !== "string" ||
    !tokenPayload.access_token
  ) {
    console.error(
      "TA14_PAYPAL_ACCESS_TOKEN_INVALID_RESPONSE",
      {
        environment: environment.environment,
        payload,
      },
    );

    throw new Error(
      "PayPal returned an invalid access token response.",
    );
  }

  return tokenPayload.access_token;
}

function collectCaptures(order: PayPalOrderResponse) {
  return (
    order.purchase_units?.flatMap(
      (purchaseUnit) =>
        purchaseUnit.payments?.captures ?? [],
    ) ?? []
  );
}

function findCompletedCapture(
  order: PayPalOrderResponse,
) {
  return collectCaptures(order).find(
    (capture) =>
      capture.status === "COMPLETED" &&
      typeof capture.id === "string",
  );
}

function payerDetails(order: PayPalOrderResponse) {
  const paypalSource =
    order.payment_source?.paypal;

  return {
    payerId:
      order.payer?.payer_id ??
      paypalSource?.account_id ??
      null,
    email:
      order.payer?.email_address ??
      paypalSource?.email_address ??
      null,
    givenName:
      order.payer?.name?.given_name ??
      paypalSource?.name?.given_name ??
      null,
    surname:
      order.payer?.name?.surname ??
      paypalSource?.name?.surname ??
      null,
    accountStatus:
      paypalSource?.account_status ?? null,
  };
}

export async function POST(request: NextRequest) {
  const environment = requiredEnvironment();

  if (!environment) {
    return jsonResponse(
      {
        error: "PAYPAL_CONFIGURATION_MISSING",
        message:
          "PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are required.",
      },
      503,
    );
  }

  let body: CaptureOrderRequestBody;

  try {
    body =
      (await request.json()) as CaptureOrderRequestBody;
  } catch {
    return jsonResponse(
      {
        error: "INVALID_REQUEST_BODY",
        message:
          "The request body must be valid JSON.",
      },
      400,
    );
  }

  const orderId =
    body.orderId?.trim().toUpperCase() ?? "";

  if (!isValidOrderId(orderId)) {
    return jsonResponse(
      {
        error: "INVALID_PAYPAL_ORDER_ID",
        message:
          "A valid PayPal order ID is required.",
      },
      400,
    );
  }

  try {
    const accessToken =
      await getPayPalAccessToken(environment);

    const captureUrl =
      `${environment.apiBase}/v2/checkout/orders/` +
      `${encodeURIComponent(orderId)}/capture`;

    const response = await fetch(captureUrl, {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
        "PayPal-Request-Id":
          `ta14-capture-${orderId}`,
        Prefer: "return=representation",
      },
      body: "{}",
    });

    const payload =
      await parseResponseBody(response);

    if (!response.ok) {
      const status =
        mapPayPalStatus(response.status);

      const publicError =
        publicPayPalError(status, payload);

      console.error(
        "TA14_PAYPAL_CAPTURE_ERROR",
        {
          orderId,
          environment:
            environment.environment,
          upstreamStatus:
            response.status,
          mappedStatus: status,
          payload,
        },
      );

      return jsonResponse(
        {
          ...publicError,
          detail: payload,
          diagnostic: {
            orderId,
            upstreamStatus:
              response.status,
            mappedStatus: status,
            paypalDebugId:
              isPayPalErrorResponse(payload)
                ? payload.debug_id ?? null
                : null,
          },
        },
        status,
      );
    }

    const order =
      payload as PayPalOrderResponse;

    if (
      typeof order.id !== "string" ||
      order.id !== orderId
    ) {
      console.error(
        "TA14_PAYPAL_CAPTURE_INVALID_ORDER_RESPONSE",
        {
          orderId,
          environment:
            environment.environment,
          payload,
        },
      );

      return jsonResponse(
        {
          error:
            "PAYPAL_CAPTURE_RESPONSE_INVALID",
          message:
            "PayPal returned an invalid order response.",
          detail: payload,
        },
        502,
      );
    }

    const completedCapture =
      findCompletedCapture(order);

    if (
      order.status !== "COMPLETED" ||
      !completedCapture ||
      typeof completedCapture.id !== "string"
    ) {
      console.error(
        "TA14_PAYPAL_CAPTURE_NOT_COMPLETED",
        {
          orderId,
          environment:
            environment.environment,
          orderStatus: order.status ?? null,
          payload,
        },
      );

      return jsonResponse(
        {
          error:
            "PAYPAL_CAPTURE_NOT_COMPLETED",
          message:
            "PayPal did not return a completed payment capture.",
          orderStatus:
            order.status ?? null,
          detail: payload,
        },
        409,
      );
    }

    const firstPurchaseUnit =
      order.purchase_units?.[0];

    const amount =
      completedCapture.amount ??
      firstPurchaseUnit?.amount ??
      null;

    const payer =
      payerDetails(order);

    return jsonResponse(
      {
        orderId: order.id,
        orderStatus: order.status,
        captureId:
          completedCapture.id,
        captureStatus:
          completedCapture.status,
        amount: amount?.value ?? null,
        currency:
          amount?.currency_code ?? null,
        referenceId:
          firstPurchaseUnit?.reference_id ??
          null,
        customId:
          firstPurchaseUnit?.custom_id ??
          null,
        invoiceId:
          firstPurchaseUnit?.invoice_id ??
          null,
        description:
          firstPurchaseUnit?.description ??
          null,
        payer,
        sellerReceivableBreakdown:
          completedCapture
            .seller_receivable_breakdown ??
          null,
        capturedAt:
          completedCapture.update_time ??
          completedCapture.create_time ??
          order.update_time ??
          null,
        environment:
          environment.environment,
        message:
          "The PayPal payment was captured successfully.",
        boundary:
          "Payment confirms purchase only. It does not create certification, approval, admissibility, or a favorable governance determination.",
      },
      200,
    );
  } catch (error) {
    const detail =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack ?? null,
          }
        : {
            message:
              "Unknown PayPal capture service error.",
          };

    console.error(
      "TA14_PAYPAL_CAPTURE_ROUTE_EXCEPTION",
      {
        orderId,
        environment:
          environment.environment,
        detail,
      },
    );

    return jsonResponse(
      {
        error:
          "PAYPAL_CAPTURE_SERVICE_UNAVAILABLE",
        message:
          "The PayPal capture service is temporarily unavailable.",
        detail,
      },
      503,
    );
  }
}
