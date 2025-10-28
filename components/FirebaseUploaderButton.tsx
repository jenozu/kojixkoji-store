"use client"

import { useState } from "react"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase-client"
import { Button } from "@/components/ui/button"

export default function FirebaseUploaderButton({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileRef = ref(storage, `uploads/${file.name}`)
      await uploadBytes(fileRef, file)
      const downloadUrl = await getDownloadURL(fileRef)
      onUploaded(downloadUrl)
    } catch (err) {
      alert("Upload failed: " + (err as Error).message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <input type="file" onChange={handleFileChange} className="hidden" id="fileInput" />
      <Button onClick={() => document.getElementById("fileInput")?.click()} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload File"}
      </Button>
    </div>
  )
}
