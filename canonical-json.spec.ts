{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ta14.org/schemas/commit.schema.json",
  "type": "object",
  "required": [
    "commitId",
    "payloadHash",
    "policyVersion",
    "destination",
    "beneficiaryId"
  ],
  "properties": {
    "commitId": {
      "type": "string",
      "pattern": "^TA14-CID-[A-Z0-9]{10,}$"
    },
    "payloadHash": {
      "type": "string",
      "pattern": "^[a-f0-9]{64}$"
    },
    "policyVersion": {
      "type": "string"
    },
    "destination": {
      "type": "string"
    },
    "beneficiaryId": {
      "type": "string"
    }
  },
  "additionalProperties": true
}