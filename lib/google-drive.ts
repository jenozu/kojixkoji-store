// lib/google-drive.ts
import { google, drive_v3 } from "googleapis"

/**
 * Prefer a server-only folder id if you set one.
 * Fallback to the public var you may have added earlier.
 */
export const DEFAULT_FOLDER_ID =
  process.env.GOOGLE_DRIVE_FOLDER_ID || process.env.NEXT_PUBLIC_GOOGLE_DRIVE_DEST_FOLDER || ""

/**
 * Create (and cache) a Google Drive client using a Service Account.
 * Expects GOOGLE_SA_EMAIL and GOOGLE_SA_PRIVATE_KEY in env.
 */
let _drive: drive_v3.Drive | null = null

export function driveClient(): drive_v3.Drive {
  if (_drive) return _drive

  const email = process.env.GOOGLE_SA_EMAIL
  const rawKey = process.env.GOOGLE_SA_PRIVATE_KEY

  if (!email) throw new Error("Missing env: GOOGLE_SA_EMAIL")
  if (!rawKey) throw new Error("Missing env: GOOGLE_SA_PRIVATE_KEY")

  // Replace escaped \n when coming from env stores
  const privateKey = rawKey.replace(/\\n/g, "\n")

  const jwt = new google.auth.JWT(email, undefined, privateKey, [
    "https://www.googleapis.com/auth/drive",
  ])

  _drive = google.drive({ version: "v3", auth: jwt })
  return _drive
}

/**
 * Moves a file into a folder (replaces prior parents).
 * If no folderId is provided, uses DEFAULT_FOLDER_ID when available.
 */
export async function moveFileToFolder(
  fileId: string,
  folderId?: string,
): Promise<drive_v3.Schema$File> {
  const dest = folderId || DEFAULT_FOLDER_ID
  if (!dest) {
    throw new Error("No target folder id provided and DEFAULT_FOLDER_ID is empty.")
  }

  const drive = driveClient()

  // Get current parents so we can remove them
  const meta = await drive.files.get({ fileId, fields: "parents" })
  const previousParents = (meta.data.parents || []).join(",")

  const { data } = await drive.files.update({
    fileId,
    addParents: dest,
    removeParents: previousParents || undefined,
    fields: "id, name, parents, webViewLink, webContentLink, mimeType",
  })

  return data
}

/**
 * Grants "anyone with the link: reader" permission so the file is viewable.
 * No-op if permission already exists (Drive API ignores duplicates).
 */
export async function makeFilePublic(fileId: string): Promise<void> {
  const drive = driveClient()
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
    },
  })
}

/**
 * Returns a reliable public URL for viewing the file.
 * For images, `uc?export=view&id=...` is a nice embeddable URL.
 * `webViewLink` is also returned as a fallback.
 */
export function buildPublicUrl(fileId: string, webViewLink?: string): string {
  // Works well for images and many common files:
  return `https://drive.google.com/uc?export=view&id=${fileId}` || webViewLink || ""
}

/**
 * Convenience helper: move → make public → return URLs & basic meta.
 */
export async function prepareFileForPublicUse(
  fileId: string,
  folderId?: string,
): Promise<{
  id: string
  name?: string | null
  publicUrl: string
  webViewLink?: string | null
  mimeType?: string | null
}> {
  const moved = await moveFileToFolder(fileId, folderId)
  await makeFilePublic(fileId)

  const publicUrl = buildPublicUrl(fileId, moved.webViewLink || undefined)

  return {
    id: moved.id!,
    name: moved.name || null,
    publicUrl,
    webViewLink: moved.webViewLink || null,
    mimeType: moved.mimeType || null,
  }
}
