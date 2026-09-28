/**
 * Implementation identities. Each fileHash is the SHA-256 of the implementation source file and is
 * enforced by conformance test (a runtime bundle cannot re-hash its own source). An identity says which
 * code ran; it confers no authority.
 */
import type { ImplementationIdentity } from "./crr/types";

export const WINDOW_STATISTICS_IMPLEMENTATION: ImplementationIdentity = Object.freeze({
  package: "ta14-exchange-platform/packages/domain/eie/analyzer/functions/window-statistics.ts",
  version: "1.0.0",
  fileHash: "71b8d5709304089833f8ca34c512eb4e243a711a29013394ff28aafa06307908",
});
