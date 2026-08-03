import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ReviewDecision =
  | 'return_for_correction'
  | 'hold'
  | 'escalate'
  | 'accept_for_registration';

type ReviewDecisionRequestBody = {
  submissionId?: string;
  decision?: ReviewDecision;
  rationale?: string;
  notes?: string;
};

type ReviewDecisionResult = {
  submission_id: string;
  status: string;
  review_decision: string;
  reviewed_at: string;
  accepted_at: string | null;
};

function requiredEnvironment() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return { supabaseUrl, supabaseAnonKey };
}

function bearerToken(request: NextRequest) {
  const authorization = request.headers.get('authorization');

  if (!authorization?.toLowerCase().startsWith('bearer ')) {
    return null;
  }

  const token = authorization.slice(7).trim();
  return token || null;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function isReviewDecision(value: unknown): value is ReviewDecision {
  return (
    value === 'return_for_correction' ||
    value === 'hold' ||
    value === 'escalate' ||
    value === 'accept_for_registration'
  );
}

function errorStatusFromSupabase(status: number, payload: unknown) {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'code' in payload &&
    typeof payload.code === 'string'
  ) {
    if (payload.code === '42501') return 403;
    if (payload.code === 'P0002') return 404;
    if (payload.code === '23514') return 409;
    if (payload.code === '22023') return 400;
    if (payload.code === 'PGRST202') return 503;
  }

  if (status === 400) return 400;
  if (status === 401) return 401;
  if (status === 403) return 403;
  if (status === 404) return 503;

  return 500;
}

function isReviewDecisionResult(value: unknown): value is ReviewDecisionResult {
  if (typeof value !== 'object' || value === null) return false;

  const row = value as Partial<ReviewDecisionResult>;

  return (
    typeof row.submission_id === 'string' &&
    typeof row.status === 'string' &&
    typeof row.review_decision === 'string' &&
    typeof row.reviewed_at === 'string' &&
    (row.accepted_at === null || typeof row.accepted_at === 'string')
  );
}

export async function POST(request: NextRequest) {
  const environment = requiredEnvironment();

  if (!environment) {
    return NextResponse.json(
      {
        error: 'REGISTRY_CONFIGURATION_MISSING',
        message:
          'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required for Registry review decisions.',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }

  const accessToken = bearerToken(request);

  if (!accessToken) {
    return NextResponse.json(
      {
        error: 'AUTHENTICATION_REQUIRED',
        message: 'A signed-in Registry reviewer session is required.',
      },
      {
        status: 401,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }

  let body: ReviewDecisionRequestBody;

  try {
    body = (await request.json()) as ReviewDecisionRequestBody;
  } catch {
    return NextResponse.json(
      {
        error: 'INVALID_REQUEST_BODY',
        message: 'The request body must be valid JSON.',
      },
      {
        status: 400,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }

  const submissionId = body.submissionId?.trim() ?? '';
  const rationale = body.rationale?.trim() ?? '';
  const notes = body.notes?.trim() ?? '';

  if (!isUuid(submissionId)) {
    return NextResponse.json(
      {
        error: 'INVALID_SUBMISSION_ID',
        message: 'A valid Registry submission UUID is required.',
      },
      {
        status: 400,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }

  if (!isReviewDecision(body.decision)) {
    return NextResponse.json(
      {
        error: 'INVALID_REVIEW_DECISION',
        message: 'Select a supported Registry review decision.',
      },
      {
        status: 400,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }

  if (rationale.length < 20) {
    return NextResponse.json(
      {
        error: 'RATIONALE_REQUIRED',
        message: 'Reviewer rationale must contain at least 20 characters.',
      },
      {
        status: 400,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }

  try {
    const response = await fetch(
      `${environment.supabaseUrl}/rest/v1/rpc/ta14_registry_record_review_decision_v2`,
      {
        method: 'POST',
        cache: 'no-store',
        headers: {
          apikey: environment.supabaseAnonKey,
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request: {
            submission_id: submissionId,
            decision: body.decision,
            rationale,
            notes: notes || null,
          },
        }),
      },
    );

    const rawBody = await response.text();
    let payload: unknown = null;

    if (rawBody) {
      try {
        payload = JSON.parse(rawBody);
      } catch {
        payload = rawBody;
      }
    }

    if (!response.ok) {
      const status = errorStatusFromSupabase(response.status, payload);

      return NextResponse.json(
        {
          error:
            status === 400
              ? 'INVALID_REVIEW_DECISION'
              : status === 401
                ? 'AUTHENTICATION_REQUIRED'
                : status === 403
                  ? 'REVIEWER_AUTHORITY_REQUIRED'
                  : status === 404
                    ? 'REGISTRY_SUBMISSION_NOT_FOUND'
                    : status === 409
                      ? 'REGISTRY_REVIEW_DECISION_BLOCKED'
                      : status === 503
                        ? 'REGISTRY_REVIEW_FUNCTION_NOT_INSTALLED'
                        : 'REGISTRY_REVIEW_DECISION_FAILED',
          message:
            status === 400
              ? 'The requested Registry review decision is invalid.'
              : status === 401
                ? 'The reviewer session is missing or expired.'
                : status === 403
                  ? 'Only an authorized TA-14 Registry reviewer may issue this decision.'
                  : status === 404
                    ? 'The requested Registry submission was not found.'
                    : status === 409
                      ? 'The Registry submission is not eligible for this review decision.'
                      : status === 503
                        ? 'The controlled Registry review decision function is unavailable.'
                        : 'The Registry review decision could not be recorded.',
          detail: payload,
        },
        {
          status,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        },
      );
    }

    if (!isReviewDecisionResult(payload)) {
      return NextResponse.json(
        {
          error: 'REGISTRY_REVIEW_RESPONSE_INVALID',
          message: 'The Registry review function returned an invalid response.',
          detail: payload,
        },
        {
          status: 500,
          headers: {
            'Cache-Control': 'no-store, max-age=0',
          },
        },
      );
    }

    return NextResponse.json(
      {
        submissionId: payload.submission_id,
        status: payload.status,
        decision: payload.review_decision,
        reviewedAt: payload.reviewed_at,
        acceptedAt: payload.accepted_at,
        message:
          payload.review_decision === 'accept_for_registration'
            ? 'The submission has been accepted for Registry finalization.'
            : 'The bounded Registry review decision has been preserved.',
        boundary: 'Review is not certification.',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
          'X-Content-Type-Options': 'nosniff',
        },
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: 'REGISTRY_REVIEW_DECISION_UNAVAILABLE',
        message: 'The Registry review decision service is temporarily unavailable.',
        detail:
          error instanceof Error
            ? error.message
            : 'Unknown Registry review service error.',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      },
    );
  }
}
TA-14 Registry Reviewer Decision API - Full Replacement Page 1 of 7
Repository path: apps/web/app/api/registry/reviewer/decision/route.ts
1 import { NextRequest, NextResponse } from 'next/server';
2
3 export const dynamic = 'force-dynamic';
4 export const revalidate = 0;
5
6 type ReviewDecision =
7  | 'return_for_correction'
8  | 'hold'
9  | 'escalate'
10  | 'accept_for_registration';
11
12 type ReviewDecisionRequestBody = {
13  submissionId?: string;
14  decision?: ReviewDecision;
15  rationale?: string;
16  notes?: string;
17 };
18
19 type ReviewDecisionResult = {
20  submission_id: string;
21  status: string;
22  review_decision: string;
23  reviewed_at: string;
24  accepted_at: string | null;
25 };
26
27 type SupabaseErrorPayload = {
28  code?: string;
29  message?: string;
30  details?: string | null;
31  hint?: string | null;
32 };
33
34 const NO_STORE_HEADERS = {
35  'Cache-Control': 'no-store, max-age=0',
36  'X-Content-Type-Options': 'nosniff',
37 };
38
39 function requiredEnvironment() {
40  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/+$/, '');
41  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
42
43  if (!supabaseUrl || !supabaseAnonKey) {
44    return null;
45  }
46
47  return { supabaseUrl, supabaseAnonKey };
48 }
49
50 function bearerToken(request: NextRequest) {
51  const authorization = request.headers.get('authorization');
52
53  if (!authorization?.toLowerCase().startsWith('bearer ')) {
54    return null;
55  }
56
57  const token = authorization.slice(7).trim();
58  return token || null;
59 }
60
61 function isUuid(value: string) {
62  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
63    value,
Replace the entire existing route.ts file with this source. Preserve the exact repository path shown above.
TA-14 Registry Reviewer Decision API - Full Replacement Page 2 of 7
Repository path: apps/web/app/api/registry/reviewer/decision/route.ts
64  );
65 }
66
67 function isReviewDecision(value: unknown): value is ReviewDecision {
68  return (
69    value === 'return_for_correction' ||
70    value === 'hold' ||
71    value === 'escalate' ||
72    value === 'accept_for_registration'
73  );
74 }
75
76 function isSupabaseErrorPayload(value: unknown): value is SupabaseErrorPayload {
77  return typeof value === 'object' && value !== null;
78 }
79
80 function supabaseCode(payload: unknown) {
81  if (!isSupabaseErrorPayload(payload)) return null;
82  return typeof payload.code === 'string' ? payload.code : null;
83 }
84
85 function errorStatusFromSupabase(status: number, payload: unknown) {
86  const code = supabaseCode(payload);
87
88  if (code === '42501') return 403;
89  if (code === 'P0002') return 404;
90  if (code === '23514') return 409;
91  if (code === '22023') return 400;
92  if (code === 'PGRST202') return 503;
93
94  if (status === 400) return 400;
95  if (status === 401) return 401;
96  if (status === 403) return 403;
97  if (status === 404) return 404;
98
99  return 500;
100 }
101
102 function publicError(status: number) {
103  if (status === 400) {
104    return {
105      error: 'INVALID_REVIEW_DECISION',
106      message: 'The requested Registry review decision is invalid.',
107    };
108  }
109
110  if (status === 401) {
111    return {
112      error: 'AUTHENTICATION_REQUIRED',
113      message: 'The reviewer session is missing or expired.',
114    };
115  }
116
117  if (status === 403) {
118    return {
119      error: 'REVIEWER_AUTHORITY_REQUIRED',
120      message: 'Only an authorized TA-14 Registry reviewer may issue this decision.',
121    };
122  }
123
124  if (status === 404) {
125    return {
126      error: 'REGISTRY_SUBMISSION_NOT_FOUND',
Replace the entire existing route.ts file with this source. Preserve the exact repository path shown above.
TA-14 Registry Reviewer Decision API - Full Replacement Page 3 of 7
Repository path: apps/web/app/api/registry/reviewer/decision/route.ts
127      message: 'The requested Registry submission was not found.',
128    };
129  }
130
131  if (status === 409) {
132    return {
133      error: 'REGISTRY_REVIEW_DECISION_BLOCKED',
134      message: 'The Registry submission is not eligible for this review decision.',
135    };
136  }
137
138  if (status === 503) {
139    return {
140      error: 'REGISTRY_REVIEW_FUNCTION_NOT_INSTALLED',
141      message: 'The controlled Registry review decision function is unavailable.',
142    };
143  }
144
145  return {
146    error: 'REGISTRY_REVIEW_DECISION_FAILED',
147    message: 'The Registry review decision could not be recorded.',
148  };
149 }
150
151 function isReviewDecisionResult(value: unknown): value is ReviewDecisionResult {
152  if (typeof value !== 'object' || value === null) return false;
153
154  const row = value as Partial<ReviewDecisionResult>;
155
156  return (
157    typeof row.submission_id === 'string' &&
158    typeof row.status === 'string' &&
159    typeof row.review_decision === 'string' &&
160    typeof row.reviewed_at === 'string' &&
161    (row.accepted_at === null || typeof row.accepted_at === 'string')
162  );
163 }
164
165 export async function POST(request: NextRequest) {
166  const environment = requiredEnvironment();
167
168  if (!environment) {
169    return NextResponse.json(
170      {
171        error: 'REGISTRY_CONFIGURATION_MISSING',
172        message:
173          'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required for Registry review decisions.',
174      },
175      {
176        status: 503,
177        headers: NO_STORE_HEADERS,
178      },
179    );
180  }
181
182  const accessToken = bearerToken(request);
183
184  if (!accessToken) {
185    return NextResponse.json(
186      {
187        error: 'AUTHENTICATION_REQUIRED',
188        message: 'A signed-in Registry reviewer session is required.',
189      },
Replace the entire existing route.ts file with this source. Preserve the exact repository path shown above.
TA-14 Registry Reviewer Decision API - Full Replacement Page 4 of 7
Repository path: apps/web/app/api/registry/reviewer/decision/route.ts
190      {
191        status: 401,
192        headers: NO_STORE_HEADERS,
193      },
194    );
195  }
196
197  let body: ReviewDecisionRequestBody;
198
199  try {
200    body = (await request.json()) as ReviewDecisionRequestBody;
201  } catch {
202    return NextResponse.json(
203      {
204        error: 'INVALID_REQUEST_BODY',
205        message: 'The request body must be valid JSON.',
206      },
207      {
208        status: 400,
209        headers: NO_STORE_HEADERS,
210      },
211    );
212  }
213
214  const submissionId = body.submissionId?.trim() ?? '';
215  const rationale = body.rationale?.trim() ?? '';
216  const notes = body.notes?.trim() ?? '';
217
218  if (!isUuid(submissionId)) {
219    return NextResponse.json(
220      {
221        error: 'INVALID_SUBMISSION_ID',
222        message: 'A valid Registry submission UUID is required.',
223      },
224      {
225        status: 400,
226        headers: NO_STORE_HEADERS,
227      },
228    );
229  }
230
231  if (!isReviewDecision(body.decision)) {
232    return NextResponse.json(
233      {
234        error: 'INVALID_REVIEW_DECISION',
235        message: 'Select a supported Registry review decision.',
236      },
237      {
238        status: 400,
239        headers: NO_STORE_HEADERS,
240      },
241    );
242  }
243
244  if (rationale.length < 20) {
245    return NextResponse.json(
246      {
247        error: 'RATIONALE_REQUIRED',
248        message: 'Reviewer rationale must contain at least 20 characters.',
249      },
250      {
251        status: 400,
252        headers: NO_STORE_HEADERS,
Replace the entire existing route.ts file with this source. Preserve the exact repository path shown above.
TA-14 Registry Reviewer Decision API - Full Replacement Page 5 of 7
Repository path: apps/web/app/api/registry/reviewer/decision/route.ts
253      },
254    );
255  }
256
257  try {
258    const response = await fetch(
259      `${environment.supabaseUrl}/rest/v1/rpc/ta14_registry_record_review_decision_v2`,
260      {
261        method: 'POST',
262        cache: 'no-store',
263        headers: {
264          apikey: environment.supabaseAnonKey,
265          Authorization: `Bearer ${accessToken}`,
266          Accept: 'application/json',
267          'Content-Type': 'application/json',
268        },
269        body: JSON.stringify({
270          request: {
271            submission_id: submissionId,
272            decision: body.decision,
273            rationale,
274            notes: notes || null,
275          },
276        }),
277      },
278    );
279
280    const rawBody = await response.text();
281    let payload: unknown = null;
282
283    if (rawBody) {
284      try {
285        payload = JSON.parse(rawBody);
286      } catch {
287        payload = rawBody;
288      }
289    }
290
291    if (!response.ok) {
292      const status = errorStatusFromSupabase(response.status, payload);
293      const mapped = publicError(status);
294
295      console.error('TA14_REGISTRY_REVIEW_RPC_ERROR', {
296        upstreamStatus: response.status,
297        mappedStatus: status,
298        rpc: 'ta14_registry_record_review_decision_v2',
299        submissionId,
300        decision: body.decision,
301        payload,
302      });
303
304      return NextResponse.json(
305        {
306          ...mapped,
307          detail: payload,
308          diagnostic: {
309            upstreamStatus: response.status,
310            mappedStatus: status,
311            rpc: 'ta14_registry_record_review_decision_v2',
312          },
313        },
314        {
315          status,
Replace the entire existing route.ts file with this source. Preserve the exact repository path shown above.
TA-14 Registry Reviewer Decision API - Full Replacement Page 6 of 7
Repository path: apps/web/app/api/registry/reviewer/decision/route.ts
316          headers: NO_STORE_HEADERS,
317        },
318      );
319    }
320
321    if (!isReviewDecisionResult(payload)) {
322      console.error('TA14_REGISTRY_REVIEW_RPC_INVALID_RESPONSE', {
323        rpc: 'ta14_registry_record_review_decision_v2',
324        submissionId,
325        decision: body.decision,
326        payload,
327      });
328
329      return NextResponse.json(
330        {
331          error: 'REGISTRY_REVIEW_RESPONSE_INVALID',
332          message: 'The Registry review function returned an invalid response.',
333          detail: payload,
334        },
335        {
336          status: 500,
337          headers: NO_STORE_HEADERS,
338        },
339      );
340    }
341
342    return NextResponse.json(
343      {
344        submissionId: payload.submission_id,
345        status: payload.status,
346        decision: payload.review_decision,
347        reviewedAt: payload.reviewed_at,
348        acceptedAt: payload.accepted_at,
349        message:
350          payload.review_decision === 'accept_for_registration'
351            ? 'The submission has been accepted for Registry finalization.'
352            : 'The bounded Registry review decision has been preserved.',
353        boundary: 'Review is not certification.',
354      },
355      {
356        status: 200,
357        headers: NO_STORE_HEADERS,
358      },
359    );
360  } catch (error) {
361    const detail =
362      error instanceof Error
363        ? {
364            name: error.name,
365            message: error.message,
366            stack: error.stack ?? null,
367          }
368        : {
369            message: 'Unknown Registry review service error.',
370          };
371
372    console.error('TA14_REGISTRY_REVIEW_ROUTE_EXCEPTION', {
373      rpc: 'ta14_registry_record_review_decision_v2',
374      submissionId,
375      decision: body.decision,
376      detail,
377    });
378
Replace the entire existing route.ts file with this source. Preserve the exact repository path shown above.
TA-14 Registry Reviewer Decision API - Full Replacement
Repository path: apps/web/app/api/registry/reviewer/decision/route.ts
Page 7 of 7
379
380
381
382
383
384
385
386
387
388
389
390
391 }
    return NextResponse.json(
      {
      },
      {
        error: 'REGISTRY_REVIEW_DECISION_UNAVAILABLE',
        message: 'The Registry review decision service is temporarily unavailable.',
        detail,
        status: 503,
        headers: NO_STORE_HEADERS,
      },
    );
  }