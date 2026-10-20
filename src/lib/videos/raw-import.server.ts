import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { rawYoutubeCatalogSchema, type RawPlaylist } from "./raw-schema";

export type { RawPlaylist, RawPlaylistVideo } from "./raw-schema";

export async function readRawPlaylistCatalog(): Promise<RawPlaylist[] | null> {
  const path = resolve(process.cwd(), "content", "import", "raw-youtube.json");
  let content: string;
  try {
    content = await readFile(path, "utf8");
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null;
    }
    throw error;
  }

  let json: unknown;
  try {
    json = JSON.parse(content);
  } catch {
    throw new Error("content/import/raw-youtube.json is not valid JSON. Re-run npm run collect:youtube.");
  }
  const result = rawYoutubeCatalogSchema.safeParse(json);
  if (!result.success) {
    throw new Error(`content/import/raw-youtube.json failed validation: ${result.error.message}`);
  }
  return result.data.playlists;
}
