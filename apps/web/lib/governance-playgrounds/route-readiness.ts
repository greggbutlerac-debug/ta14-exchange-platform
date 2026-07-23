import type {
  JsonValue,
  LaneDefinition,
  PlaygroundFieldDefinition,
} from "./types";

/**
 * TA-14 Governance-Specific Playgrounds
 * Route intake readiness evaluation
 *
 * This module does not issue ALLOW, HOLD, DENY, or ESCALATE.
 * It only determines whether a route configuration is complete and
 * structurally valid enough to enter governance testing.
 */

export type RouteReadinessStatus =
  | "INCOMPLETE"
  | "INVALID"
  | "READY_FOR_TEST";

export interface RouteReadinessIssue {
  code:
    | "REQUIRED_FIELD_MISSING"
    | "INVALID_JSON"
    | "MIN_LENGTH"
    | "MAX_LENGTH"
    | "MINIMUM"
    | "MAXIMUM"
    | "PATTERN_MISMATCH"
    | "UNKNOWN_FIELD";
  message: string;
  fieldKey: string;
  sectionId?: string;
}

export interface RouteReadinessResult {
  status: RouteReadinessStatus;
  ready: boolean;
  completionPercentage: number;
  completedRequiredFields: number;
  totalRequiredFields: number;
  issues: RouteReadinessIssue[];
  normalizedValues: Readonly<Record<string, JsonValue>>;
}

function isPresent(value: JsonValue | undefined): boolean {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "boolean") {
    return true;
  }

  return (
    value !== undefined &&
    value !== null &&
    String(value).trim() !== ""
  );
}

function fieldApplies(
  field: PlaygroundFieldDefinition,
  values: Readonly<Record<string, JsonValue>>,
): boolean {
  if (!field.appliesWhen || field.appliesWhen.length === 0) {
    return true;
  }

  return field.appliesWhen.every((rule) => {
    const currentValue = values[rule.field];

    switch (rule.operator) {
      case "equals":
        return currentValue === rule.expected;
      case "not_equals":
        return currentValue !== rule.expected;
      case "exists":
        return isPresent(currentValue);
      case "not_exists":
        return !isPresent(currentValue);
      case "includes":
        return Array.isArray(currentValue)
          ? currentValue.some(
              (item) => item === rule.expected,
            )
          : String(currentValue ?? "").includes(
              String(rule.expected ?? ""),
            );
      case "not_includes":
        return Array.isArray(currentValue)
          ? !currentValue.some(
              (item) => item === rule.expected,
            )
          : !String(currentValue ?? "").includes(
              String(rule.expected ?? ""),
            );
      case "greater_than":
        return (
          typeof currentValue === "number" &&
          typeof rule.expected === "number" &&
          currentValue > rule.expected
        );
      case "less_than":
        return (
          typeof currentValue === "number" &&
          typeof rule.expected === "number" &&
          currentValue < rule.expected
        );
    }
  });
}

function validateField(
  field: PlaygroundFieldDefinition,
  value: JsonValue | undefined,
  sectionId: string,
): RouteReadinessIssue[] {
  const issues: RouteReadinessIssue[] = [];

  if (field.required && !isPresent(value)) {
    issues.push({
      code: "REQUIRED_FIELD_MISSING",
      message: `"${field.label}" is required.`,
      fieldKey: field.key,
      sectionId,
    });

    return issues;
  }

  if (!isPresent(value)) {
    return issues;
  }

  if (field.type === "json") {
    if (typeof value !== "string") {
      issues.push({
        code: "INVALID_JSON",
        message: `"${field.label}" must contain valid JSON text.`,
        fieldKey: field.key,
        sectionId,
      });

      return issues;
    }

    try {
      JSON.parse(value);
    } catch {
      issues.push({
        code: "INVALID_JSON",
        message: `"${field.label}" contains invalid JSON.`,
        fieldKey: field.key,
        sectionId,
      });
    }
  }

  const validation = field.validation;

  if (!validation) {
    return issues;
  }

  const stringValue =
    typeof value === "string" ? value : String(value);

  if (
    validation.minLength !== undefined &&
    stringValue.length < validation.minLength
  ) {
    issues.push({
      code: "MIN_LENGTH",
      message: `"${field.label}" must contain at least ${validation.minLength} characters.`,
      fieldKey: field.key,
      sectionId,
    });
  }

  if (
    validation.maxLength !== undefined &&
    stringValue.length > validation.maxLength
  ) {
    issues.push({
      code: "MAX_LENGTH",
      message: `"${field.label}" must contain no more than ${validation.maxLength} characters.`,
      fieldKey: field.key,
      sectionId,
    });
  }

  if (
    validation.minimum !== undefined &&
    typeof value === "number" &&
    value < validation.minimum
  ) {
    issues.push({
      code: "MINIMUM",
      message: `"${field.label}" must be at least ${validation.minimum}.`,
      fieldKey: field.key,
      sectionId,
    });
  }

  if (
    validation.maximum !== undefined &&
    typeof value === "number" &&
    value > validation.maximum
  ) {
    issues.push({
      code: "MAXIMUM",
      message: `"${field.label}" must be no greater than ${validation.maximum}.`,
      fieldKey: field.key,
      sectionId,
    });
  }

  if (
    validation.pattern &&
    typeof value === "string" &&
    !new RegExp(validation.pattern).test(value)
  ) {
    issues.push({
      code: "PATTERN_MISMATCH",
      message: `"${field.label}" does not match the required format.`,
      fieldKey: field.key,
      sectionId,
    });
  }

  return issues;
}

export function evaluateRouteReadiness(
  lane: LaneDefinition,
  values: Readonly<Record<string, JsonValue>>,
): RouteReadinessResult {
  const issues: RouteReadinessIssue[] = [];
  const knownFieldKeys = new Set<string>();
  let totalRequiredFields = 0;
  let completedRequiredFields = 0;

  for (const section of lane.sections) {
    for (const field of section.fields) {
      knownFieldKeys.add(field.key);

      if (!fieldApplies(field, values)) {
        continue;
      }

      const value = values[field.key];

      if (field.required) {
        totalRequiredFields += 1;

        if (isPresent(value)) {
          completedRequiredFields += 1;
        }
      }

      issues.push(
        ...validateField(field, value, section.sectionId),
      );
    }
  }

  for (const fieldKey of Object.keys(values)) {
    if (!knownFieldKeys.has(fieldKey)) {
      issues.push({
        code: "UNKNOWN_FIELD",
        message: `Unknown route field "${fieldKey}" is not defined by lane "${lane.laneId}".`,
        fieldKey,
      });
    }
  }

  const completionPercentage =
    totalRequiredFields === 0
      ? 100
      : Math.round(
          (completedRequiredFields / totalRequiredFields) * 100,
        );

  const hasMissingRequiredFields = issues.some(
    (item) => item.code === "REQUIRED_FIELD_MISSING",
  );

  const hasInvalidFields = issues.some(
    (item) => item.code !== "REQUIRED_FIELD_MISSING",
  );

  const status: RouteReadinessStatus = hasMissingRequiredFields
    ? "INCOMPLETE"
    : hasInvalidFields
      ? "INVALID"
      : "READY_FOR_TEST";

  const normalizedValues = Object.fromEntries(
    Object.entries(values).map(([fieldKey, value]) => {
      const field = lane.sections
        .flatMap((section) => section.fields)
        .find((item) => item.key === fieldKey);

      if (
        field?.type === "json" &&
        typeof value === "string" &&
        value.trim() !== ""
      ) {
        try {
          return [fieldKey, JSON.parse(value) as JsonValue];
        } catch {
          return [fieldKey, value];
        }
      }

      return [fieldKey, value];
    }),
  );

  return {
    status,
    ready: status === "READY_FOR_TEST",
    completionPercentage,
    completedRequiredFields,
    totalRequiredFields,
    issues,
    normalizedValues,
  };
}
