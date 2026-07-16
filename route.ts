{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ta14.org/schemas/route.schema.json",
  "type": "object",
  "required": [
    "rid",
    "systemId",
    "version",
    "purpose",
    "action",
    "threshold",
    "destination",
    "policyVersion",
    "expectedOutcome"
  ],
  "properties": {
    "rid": {
      "type": "string",
      "pattern": "^TA14-RID-[A-Z0-9]{12,}$"
    },
    "systemId": {
      "type": "string"
    },
    "version": {
      "type": "integer",
      "minimum": 1
    },
    "purpose": {
      "type": "string"
    },
    "action": {
      "type": "string"
    },
    "threshold": {
      "type": "number"
    },
    "destination": {
      "type": "string"
    },
    "policyVersion": {
      "type": "string"
    },
    "expectedOutcome": {
      "type": "string"
    }
  },
  "additionalProperties": true
}