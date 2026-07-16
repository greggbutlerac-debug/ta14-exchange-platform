{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ta14.org/schemas/authority.schema.json",
  "type": "object",
  "required": [
    "authorityId",
    "issuer",
    "role",
    "scope",
    "effectiveAt",
    "expiresAt",
    "revocationState",
    "boundAction"
  ],
  "properties": {
    "authorityId": {
      "type": "string",
      "pattern": "^TA14-AID-[A-Z0-9]{10,}$"
    },
    "issuer": {
      "type": "string"
    },
    "role": {
      "type": "string"
    },
    "scope": {
      "type": "string"
    },
    "effectiveAt": {
      "type": "string",
      "format": "date-time"
    },
    "expiresAt": {
      "type": "string",
      "format": "date-time"
    },
    "revocationState": {
      "enum": [
        "active",
        "revoked",
        "unknown"
      ]
    },
    "boundAction": {
      "type": "string"
    }
  },
  "additionalProperties": true
}