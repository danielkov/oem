import createLog from "@oem/log";
import { merge } from "@oem/util";
import { Manifest, ManifestEntry } from "@oem/types";

const log = createLog("@oem:manifest");

const createManifest = () => {
  log`Creating new manifest`;
  const manifest: Manifest = [];
  const update = (newEntry: ManifestEntry) => {
    log`Updating manifest: ${manifest} update: ${newEntry}`;
    const oldEntryIndex = manifest.findIndex(
      entry => entry.path === newEntry.path
    );
    log`Index of old entry: ${oldEntryIndex}`;
    if (~oldEntryIndex) {
      const oldEntry = manifest[oldEntryIndex];
      log`Updating old entry: ${oldEntry}`;
      manifest[oldEntryIndex] = merge(oldEntry, newEntry);
      return;
    }
    log`Adding new entry`;
    manifest.push(newEntry);
  };
  const get = () => {
    log`Retrieving manifest: ${manifest}`;
    return [...manifest];
  };
  return { update, get };
};

export default createManifest();
