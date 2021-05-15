import createLog from "@modernist/log";
import { Manifest, ManifestEntry } from "@modernist/types";
import { merge } from "@modernist/util";

const log = createLog("@modernist/manifest");

const createManifest = () => {
  log`Creating new manifest`;
  const manifest: Manifest = [];
  const update = (newEntry: ManifestEntry) => {
    log`Updating manifest: ${manifest} update: ${newEntry}`;
    const oldEntryIndex = manifest.findIndex((entry) => {
      return entry.path === newEntry.path;
    });
    log`Index of old entry: ${oldEntryIndex}`;
    // eslint-disable-next-line no-bitwise
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
