{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ta14.org/schemas/outcome.schema.json",
  "type": "object",
  "required": [
    "outcomeId",
    "observedAt",
    "summary",
    "correspondenceState"
  ],
  "properties": {
    "outcomeId": {
      "type": "string",
      "pattern": "^TA14-OID-[A-Z0-9]{10,}$"
    },
    "observedAt": {
      "type": "string",
      "format": "date-time"
    },
    "summary": {
      "type": "string"
    },
    "correspondenceState": {
      "enum": [
        "matched",
        "variance",
        "unresolved"
      ]
    }
  },
  "additionalProperties": true
}