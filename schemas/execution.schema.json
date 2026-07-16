{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ta14.org/schemas/execution.schema.json",
  "type": "object",
  "required": [
    "executionId",
    "commitId",
    "executedAt",
    "actorId",
    "destination",
    "payloadHash"
  ],
  "properties": {
    "executionId": {
      "type": "string",
      "pattern": "^TA14-XID-[A-Z0-9]{10,}$"
    },
    "commitId": {
      "type": "string"
    },
    "executedAt": {
      "type": "string",
      "format": "date-time"
    },
    "actorId": {
      "type": "string"
    },
    "destination": {
      "type": "string"
    },
    "payloadHash": {
      "type": "string"
    }
  },
  "additionalProperties": true
}