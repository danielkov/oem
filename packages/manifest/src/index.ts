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
    if (oldEntryIndex) {
      const oldEntry = manifest[oldEntryIndex];
      manifest[oldEntryIndex] = merge(oldEntry, newEntry);
      return;
    }
    manifest.push(newEntry);
  };
  const get = () => {
    log`Retrieving manifest: ${manifest}`;
    return [...manifest];
  };
  return { update, get };
};

export default createManifest();
