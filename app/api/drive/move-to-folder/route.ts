// app/api/drive/move-to-folder/route.ts
import { NextResponse } from "next/server"
import { DEFAULT_FOLDER_ID, prepareFileForPublicUse } from "@/lib/google-drive"

export async function POST(req: Request) {
  try {
    const { fileId, targetFolderId } = await req.json()

    if (!fileId) {
      return NextResponse.json({ ok: false, error: "Missing fileId" }, { status: 400 })
    }

    const folder = targetFolderId || DEFAULT_FOLDER_ID
    if (!folder) {
      return NextResponse.json(
        { ok: false, error: "No target folder configured. Set GOOGLE_DRIVE_FOLDER_ID or NEXT_PUBLIC_GOOGLE_DRIVE_DEST_FOLDER, or pass targetFolderId." },
        { status: 400 }
      )
    }

    const res = await prepareFileForPublicUse(fileId, folder)

    return NextResponse.json({
      ok: true,
      id: res.id,
      name: res.name,
      publicUrl: res.publicUrl,
      webViewLink: res.webViewLink,
      mimeType: res.mimeType,
      folderId: folder,
    })
  } catch (err: any) {
    console.error("move-to-folder error:", err?.message || err)
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 })
  }
}
