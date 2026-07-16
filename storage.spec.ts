{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ta14.org/schemas/organization.schema.json",
  "type": "object",
  "required": [
    "orgId",
    "displayName",
    "ownerUserId",
    "identityLevel",
    "status"
  ],
  "properties": {
    "orgId": {
      "type": "string",
      "pattern": "^TA14-ORG-[A-Z0-9]{10,}$"
    },
    "displayName": {
      "type": "string",
      "minLength": 1
    },
    "ownerUserId": {
      "type": "string"
    },
    "identityLevel": {
      "enum": [
        "email_verified",
        "organization_verified",
        "enhanced"
      ]
    },
    "status": {
      "enum": [
        "active",
        "limited",
        "suspended",
        "closed"
      ]
    }
  },
  "additionalProperties": false
}