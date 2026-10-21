# ENEE

ENEE organizes YouTube video courses for Ethiopian students in Grades 9–12. Source videos remain hosted by YouTube; this project uses the official YouTube Data API v3 for playlist metadata and never downloads or re-uploads videos.

## Requirements and setup

- Node.js 20.9 or newer
- npm
- A Supabase project for sign-in and protected routes
- A Google Cloud API key with YouTube Data API v3 enabled to collect playlists

```powershell
npm install
Copy-Item .env.example .env.local
```

Set the Supabase URL and publishable key in `.env.local`. Add `YOUTUBE_API_KEY` there when ready to collect. The YouTube key is only read by server-side scripts; do not prefix it with `NEXT_PUBLIC_`, print it, or commit `.env.local`. `.env*` files are ignored by git.

Run the Supabase migration in `supabase/migrations/202610200001_initial_schema.sql` using the SQL Editor, or:

```powershell
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Enable Supabase email/password sign-in and set the local site URL to `http://localhost:3000`, then run:

```powershell
npm run dev
```

## Automated YouTube collection and review

1. Enable YouTube Data API v3 in Google Cloud Console and place the key in `.env.local`:
   ```text
   YOUTUBE_API_KEY=your-server-side-api-key
   ```
2. Collect the public playlists for `@zsecrettraininginstitute`:
   ```powershell
   npm run collect:youtube
   ```
   The script uses `channels.list`, paginated `playlists.list` and `playlistItems.list`, and `videos.list` requests in batches of 50. It uses native `fetch`, reports network/auth/quota failures without printing the key, and skips unavailable private/deleted videos.
3. Review `content/import/review.csv`. All rows start with `status=needs_review`. Edit the suggested fields using the exact allowed subject names, `natural`, `social`, or `natural|social` for streams, and change only the rows you approve to `status=approved`.
4. Import reviewed rows:
   ```powershell
   npm run import:reviewed
   ```
   This imports only approved rows, validates them with the catalog Zod schema, and prints CSV row numbers for invalid approvals. Playlists with unit references in their video titles are split into title-backed unit entries; playlists without unit references receive one `Full Course` unit. Unitless lessons in a playlist that otherwise has unit references are not assigned to a guessed unit. Repeated imports preserve entries already in the catalog instead of duplicating or overwriting them. Imported entries stay `needs_verification` until separately verified.
5. Inspect the catalog:
   ```powershell
   npm run videos:report
   ```

Collection output:

- `content/import/raw-youtube.json`: channel metadata and each playlist’s ID/title, accessible video count, embeddability summary, and public video IDs/titles/positions/embeddability/durations.
- `content/import/review.csv`: one editable review row per playlist.

Suggestions are deliberately title-only and conservative: an explicit `Grade 9`–`Grade 12`; `Mathematics`, `Maths`, or `Math`; `Econ` or `Economics`; exact subject names; `Unit N`; and `New curriculum` or `Old curriculum`. Unit names are taken from title text following the unit number. Shared subjects map to both streams, natural-only subjects to `natural`, and social-only subjects to `social`. `courseLabel` may be set to `Course A` or `Course B` to distinguish separate playlists in a subject. Review every suggestion manually.

The playlist title remains the catalog title, the playlist ID is the YouTube playlist embed target, and API-resolved channel name plus the supplied channel handle are recorded as credits. Lesson playback uses each video's own embeddability status: embeddable lessons can load in the privacy-enhanced player, while non-embeddable lessons link directly to YouTube.

## Catalog/library features

The library supports text search and grade, stream, subject, and unit filters. Unit pages show collected lessons grouped by unit references from their titles; selecting a lesson starts the privacy-enhanced playlist at that lesson and loads the thumbnail/player only after pressing play. Non-embeddable videos show an **Open on YouTube** link instead of an iframe. About and course pages show channel credits.

The three original sample placeholders remain in `content/videos.json` and are not real video records. They can be removed manually when you are ready; the review importer does not overwrite or remove hand-edited entries.

## Checks

```powershell
npm run lint
npx tsc --noEmit
npm test
npm run build
npm run test:e2e
```

Vitest and Playwright are configured. `npm test` contains focused import-helper/schema tests; broader UI and end-to-end coverage can be expanded in the testing stage.
