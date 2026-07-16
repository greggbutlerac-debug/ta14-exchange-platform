{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ta14.org/schemas/system.schema.json",
  "type": "object",
  "required": [
    "systemId",
    "orgId",
    "name",
    "version",
    "environment",
    "intendedPurpose"
  ],
  "properties": {
    "systemId": {
      "type": "string",
      "pattern": "^TA14-SYS-[A-Z0-9]{10,}$"
    },
    "orgId": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "version": {
      "type": "string"
    },
    "environment": {
      "enum": [
        "development",
        "test",
        "staging",
        "production",
        "other"
      ]
    },
    "intendedPurpose": {
      "type": "string"
    }
  },
  "additionalProperties": false
}