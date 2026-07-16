{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ta14.org/schemas/evidence.schema.json",
  "type": "object",
  "required": [
    "evidenceId",
    "source",
    "type",
    "capturedAt",
    "contentHash",
    "validityState",
    "classification"
  ],
  "properties": {
    "evidenceId": {
      "type": "string",
      "pattern": "^TA14-EID-[A-Z0-9]{10,}$"
    },
    "source": {
      "type": "string"
    },
    "type": {
      "type": "string"
    },
    "capturedAt": {
      "type": "string",
      "format": "date-time"
    },
    "contentHash": {
      "type": "string",
      "pattern": "^[a-f0-9]{64}$"
    },
    "validityState": {
      "enum": [
        "current",
        "stale",
        "revoked",
        "unknown"
      ]
    },
    "classification": {
      "enum": [
        "public",
        "private",
        "restricted",
        "regulated",
        "institutional"
      ]
    }
  },
  "additionalProperties": true
}