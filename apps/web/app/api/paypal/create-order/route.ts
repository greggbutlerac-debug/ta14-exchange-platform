import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

type PayPalEnvironment = 'sandbox' | 'live';

type ProductId =
  | 'preserved-governed-run'
  | 'independent-partner-review'
  | 'dual-partner-review'
  | 'architecture-demonstration'
  | 'multidisciplinary-review-panel'
  | 'exchange-pro-monthly'
  | 'exchange-pro-annual'
  | 'organization-monthly'
  | 'organization-annual'
  | 'verified-network-partner-annual'
  | 'governance-entity-partner-annual'
  | 'institutional-partner-annual';

type CatalogProduct = {
  id: ProductId;
  name: string;
  description: string;
  price: string;
  currency: 'USD';
  category: 'preservation' | 'review' | 'demonstration' | 'workspace' | 'partner-network';
  billing: 'one-time' | 'monthly' | 'annual';
};

type CreateOrderRequestBody = {
  productId?: string;
  customerReference?: string;
};

type PayPalAccessTokenResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
};

type PayPalOrderResponse = {
  id?: string;
  status?: string;
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
};

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
  'X-Content-Type-Options': 'nosniff',
};

const PRODUCT_CATALOG: Record<ProductId, CatalogProduct> = {
  'preserved-governed-run': {
    id: 'preserved-governed-run',
    name: 'Preserved Governed Run',
    description:
      'One attributable, replayable governed route record with preserved evidence references and decision history.',
    price: '9.00',
    currency: 'USD',
    category: 'preservation',
    billing: 'one-time',
  },
  'independent-partner-review': {
    id: 'independent-partner-review',
    name: 'Independent Partner Review',
    description:
      'One bounded independent review through the TA-14 Partner Review Network.',
    price: '995.00',
    currency: 'USD',
    category: 'review',
    billing: 'one-time',
  },
  'dual-partner-review': {
    id: 'dual-partner-review',
    name: 'Dual-Partner Review',
    description:
      'Two independent bounded reviews with preserved agreement, disagreement, and TA-14 synthesis.',
    price: '1995.00',
    currency: 'USD',
    category: 'review',
    billing: 'one-time',
  },
  'architecture-demonstration': {
    id: 'architecture-demonstration',
    name: 'Architecture-to-Architecture Demonstration',
    description:
      'A governed demonstration of one bounded capability through the TA-14 AI Governance Exchange.',
    price: '2495.00',
    currency: 'USD',
    category: 'demonstration',
    billing: 'one-time',
  },
  'multidisciplinary-review-panel': {
    id: 'multidisciplinary-review-panel',
    name: 'Multidisciplinary Review Panel',
    description:
      'A governed review panel involving multiple independent domain perspectives.',
    price: '3995.00',
    currency: 'USD',
    category: 'review',
    billing: 'one-time',
  },
  'exchange-pro-monthly': {
    id: 'exchange-pro-monthly',
    name: 'TA-14 Exchange Pro — Monthly',
    description:
      'Professional workspace access for building, preserving, comparing, and improving governed routes.',
    price: '99.00',
    currency: 'USD',
    category: 'workspace',
    billing: 'monthly',
  },
  'exchange-pro-annual': {
    id: 'exchange-pro-annual',
    name: 'TA-14 Exchange Pro — Annual',
    description:
      'Annual professional workspace access for governed route construction and preservation.',
    price: '990.00',
    currency: 'USD',
    category: 'workspace',
    billing: 'annual',
  },
  'organization-monthly': {
    id: 'organization-monthly',
    name: 'TA-14 Organization Workspace — Monthly',
    description:
      'Organization-level governance workspace access for teams, systems, records, and review workflows.',
    price: '499.00',
    currency: 'USD',
    category: 'workspace',
    billing: 'monthly',
  },
  'organization-annual': {
    id: 'organization-annual',
    name: 'TA-14 Organization Workspace — Annual',
    description:
      'Annual organization-level governance workspace access for teams and controlled review workflows.',
    price: '4990.00',
    currency: 'USD',
    category: 'workspace',
    billing: 'annual',
  },
  'verified-network-partner-annual': {
    id: 'verified-network-partner-annual',
    name: 'Verified Network Partner — Annual',
    description:
      'Annual Partner Review Network participation for an independently verified reviewer or specialist.',
    price: '795.00',
    currency: 'USD',
    category: 'partner-network',
    billing: 'annual',
  },
  'governance-entity-partner-annual': {
    id: 'governance-entity-partner-annual',
    name: 'Governance Entity Partner — Annual',
    description:
      'Annual Partner Review Network participation for an AI governance entity or architecture owner.',
    price: '1995.00',
    currency: 'USD',
    category: 'partner-network',
    billing: 'annual',
  },
  'institutional-partner-annual': {
    id: 'institutional-partner-annual',
    name: 'Institutional Partner — Annual',
    description:
      'Annual Partner Review Network participation for a university, research group, standards body, or institution.',
    price: '3995.00',
    currency: 'USD',
    category: 'partner-network',
    billing: 'annual',
  },
};

function jsonResponse(body: Record<string, unknown>, status: number) {
  return NextResponse.json(body, {
    status,
    headers: NO_STORE_HEADERS,
  });
}

function requiredEnvironment() {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();
  const environmentValue = process.env.PAYPAL_ENVIRONMENT?.trim().toLowerCase();

  const environment: PayPalEnvironment =
    environmentValue === 'sandbox' ? 'sandbox' : 'live';

  if (!clientId || !clientSecret) {
    return null;
  }

  const apiBase =
    environment === 'sandbox'
      ? 'https://api-m.sandbox.paypal.com'
      : 'https://api-m.paypal.com';

  return {
    clientId,
    clientSecret,
    environment,
    apiBase,
  };
}

function isProductId(value: string): value is ProductId {
  return Object.prototype.hasOwnProperty.call(PRODUCT_CATALOG, value);
}

function normalizeCustomerReference(value: unknown) {
  if (typeof value !== 'string') return null;

  const normalized = value.trim().replace(/[^a-zA-Z0-9._:@+-]/g, '-').slice(0, 80);
  return normalized || null;
}

function basicAuthorization(clientId: string, clientSecret: string) {
  return Buffer.from(`${clientId}:${clientSecret}`, 'utf8').toString('base64');
}

async function parseResponseBody(response: Response) {
  const rawBody = await response.text();

  if (!rawBody) return null;

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    return rawBody;
  }
}

function isPayPalErrorResponse(value: unknown): value is PayPalErrorResponse {
  return typeof value === 'object' && value !== null;
}

async function getPayPalAccessToken(
  environment: NonNullable<ReturnType<typeof requiredEnvironment>>,
) {
  const response = await fetch(`${environment.apiBase}/v1/oauth2/token`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      Authorization: `Basic ${basicAuthorization(
        environment.clientId,
        environment.clientSecret,
      )}`,
      Accept: 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const payload = await parseResponseBody(response);

  if (!response.ok) {
    console.error('TA14_PAYPAL_ACCESS_TOKEN_ERROR', {
      upstreamStatus: response.status,
      environment: environment.environment,
      payload,
    });

    throw new Error('PayPal access token request failed.');
  }

  const tokenPayload = payload as PayPalAccessTokenResponse;

  if (typeof tokenPayload.access_token !== 'string' || !tokenPayload.access_token) {
    console.error('TA14_PAYPAL_ACCESS_TOKEN_INVALID_RESPONSE', {
      environment: environment.environment,
      payload,
    });

    throw new Error('PayPal returned an invalid access token response.');
  }

  return tokenPayload.access_token;
}

export async function POST(request: NextRequest) {
  const environment = requiredEnvironment();

  if (!environment) {
    return jsonResponse(
      {
        error: 'PAYPAL_CONFIGURATION_MISSING',
        message:
          'PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET are required to create PayPal orders.',
      },
      503,
    );
  }

  let body: CreateOrderRequestBody;

  try {
    body = (await request.json()) as CreateOrderRequestBody;
  } catch {
    return jsonResponse(
      {
        error: 'INVALID_REQUEST_BODY',
        message: 'The request body must be valid JSON.',
      },
      400,
    );
  }

  const requestedProductId = body.productId?.trim() ?? '';

  if (!isProductId(requestedProductId)) {
    return jsonResponse(
      {
        error: 'INVALID_PAYPAL_PRODUCT',
        message: 'Select a supported TA-14 product or governed service pathway.',
        supportedProductIds: Object.keys(PRODUCT_CATALOG),
      },
      400,
    );
  }

  const product = PRODUCT_CATALOG[requestedProductId];
  const customerReference = normalizeCustomerReference(body.customerReference);
  const orderReference = `TA14-${randomUUID()}`;
  const invoiceId = `TA14-${Date.now()}-${randomUUID().slice(0, 8)}`;

  try {
    const accessToken = await getPayPalAccessToken(environment);

    const response = await fetch(`${environment.apiBase}/v2/checkout/orders`, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'PayPal-Request-Id': orderReference,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: product.id,
            custom_id: customerReference
              ? `${product.id}:${customerReference}`
              : product.id,
            invoice_id: invoiceId,
            description: product.name,
            amount: {
              currency_code: product.currency,
              value: product.price,
              breakdown: {
                item_total: {
                  currency_code: product.currency,
                  value: product.price,
                },
              },
            },
            items: [
              {
                name: product.name,
                description: product.description,
                unit_amount: {
                  currency_code: product.currency,
                  value: product.price,
                },
                quantity: '1',
                category: 'DIGITAL_GOODS',
              },
            ],
          },
        ],
        application_context: {
          brand_name: 'TA-14 Authority',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING',
        },
      }),
    });

    const payload = await parseResponseBody(response);

    if (!response.ok) {
      console.error('TA14_PAYPAL_CREATE_ORDER_ERROR', {
        productId: product.id,
        environment: environment.environment,
        upstreamStatus: response.status,
        payload,
      });

      return jsonResponse(
        {
          error: 'PAYPAL_ORDER_CREATION_FAILED',
          message: 'PayPal could not create the payment order.',
          detail: payload,
          diagnostic: {
            productId: product.id,
            upstreamStatus: response.status,
            paypalDebugId: isPayPalErrorResponse(payload)
              ? payload.debug_id ?? null
              : null,
          },
        },
        response.status >= 500 ? 503 : 502,
      );
    }

    const order = payload as PayPalOrderResponse;

    if (typeof order.id !== 'string' || !order.id) {
      console.error('TA14_PAYPAL_CREATE_ORDER_INVALID_RESPONSE', {
        productId: product.id,
        environment: environment.environment,
        payload,
      });

      return jsonResponse(
        {
          error: 'PAYPAL_ORDER_RESPONSE_INVALID',
          message: 'PayPal returned an invalid order response.',
          detail: payload,
        },
        502,
      );
    }

    const approvalUrl =
      order.links?.find((link) => link.rel === 'approve')?.href ?? null;

    return jsonResponse(
      {
        orderId: order.id,
        orderStatus: order.status ?? 'CREATED',
        approvalUrl,
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          currency: product.currency,
          category: product.category,
          billing: product.billing,
        },
        invoiceId,
        customerReference,
        environment: environment.environment,
        message: 'The PayPal order was created successfully.',
        boundary:
          'Payment purchases only the stated service pathway. It does not purchase certification, approval, admissibility, endorsement, or a favorable governance determination.',
      },
      201,
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
            message: 'Unknown PayPal order service error.',
          };

    console.error('TA14_PAYPAL_CREATE_ORDER_ROUTE_EXCEPTION', {
      productId: product.id,
      environment: environment.environment,
      detail,
    });

    return jsonResponse(
      {
        error: 'PAYPAL_ORDER_SERVICE_UNAVAILABLE',
        message: 'The PayPal order service is temporarily unavailable.',
        detail,
      },
      503,
    );
  }
}
