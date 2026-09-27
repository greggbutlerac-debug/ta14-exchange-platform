/**
 * The governed OEM reference registry shipped with NIRET Gate A (Amendment A7).
 * Empty by owner ruling until a genuine manufacturer source is registered.
 */

import manifest from "./manifest.json";
import { REGISTERED_RECORDS } from "./records";
import { loadOemRegistry, type OemRegistry } from "./registry";

export const GOVERNED_OEM_REGISTRY: OemRegistry = loadOemRegistry(REGISTERED_RECORDS, manifest);

export {
  citation,
  identityKey,
  loadOemRegistry,
  projectRecord,
  registrationFindings,
  resolveOemReference,
  type OemReferenceRecord,
  type OemRegistry,
  type OemResolution,
  type RegistryManifest,
} from "./registry";
