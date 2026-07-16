# MVP API Contract

| Method / endpoint | Purpose | Key contract |
|---|---|---|
| POST /api/v1/organizations | Create organization | Authenticated, idempotent, returns TA14-ORG |
| POST /api/v1/systems | Register system | Organization role required, returns TA14-SYS |
| POST /api/v1/routes | Create bounded route | Validates scope, returns draft TA14-RID |
| POST /api/v1/routes/{rid}/evidence | Attach evidence metadata/upload | Private by default, type/size/class checks |
| POST /api/v1/routes/{rid}/test | Run tests | Pins route/policy versions, returns bounded receipt |
| POST /api/v1/routes/{rid}/rerun | Correct and rerun | Creates new immutable version, never overwrites |
| GET /api/v1/routes/{rid}/aer | Retrieve AER | Includes boundary and current state |
| POST /api/v1/checkout/durable-record | Create checkout | No effect on decision state |
| POST /api/v1/payments/webhook | Process payment event | Signature validation, idempotency, replay protection |
| GET /api/v1/registry/{rid} | Registry lookup | Minimal data, live status, signature, limitations |
| POST /api/v1/registry/{rid}/misuse | Report misuse | Rate-limited, evidence retained, triage status |

All write endpoints require authentication, authorization, validation, audit logging, and an idempotency strategy where duplication can cause harm.
