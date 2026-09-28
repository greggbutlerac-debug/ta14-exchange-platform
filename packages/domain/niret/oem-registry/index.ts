/**
 * The governed OEM reference registry shipped with NIRET Gate A (Amendments A7/A8).
 * Empty by owner ruling until a genuine manufacturer source is registered.
 */

import manifest from "./manifest.json";
import { REGISTERED_BINDINGS, REGISTERED_RECORDS } from "./records";
import { loadOemRegistry, type OemRegistry } from "./registry";

export const GOVERNED_OEM_REGISTRY: OemRegistry = loadOemRegistry(REGISTERED_RECORDS, REGISTERED_BINDINGS, manifest);

export {
  bindingFindings,
  citation,
  identityKey,
  loadOemRegistry,
  projectBinding,
  registrationFindings,
  resolveOemReference,
  type OemReferenceRecord,
  type OemRegistry,
  type OemResolution,
  type OemSystemBinding,
  type RegistryManifest,
} from "./registry";
