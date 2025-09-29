"use client"

import { useState, useMemo } from "react"
import DrivePickerButton from "@/components/DrivePickerButton"

type PickResult = { fileId: string; publicUrl: string }

export default function PickerTest() {
  const [result, setResult] = useState<PickResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // helpful inline diagnostics so you know your envs are available on the client
  const diag = useMemo(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID
    return {
      apiKeyOk: Boolean(apiKey && apiKey.length > 10),
      clientIdOk: Boolean(clientId && clientId.includes(".googleusercontent.com")),
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Google Picker Test</h1>
        <p className="text-sm text-muted-foreground">
          Use the button below to upload/select an image from Google Drive. The file will be moved
          to your configured folder and made viewable, then the public URL will appear here.
        </p>
      </div>

      {/* quick diagnostics */}
      <div className="rounded-md border p-4 text-sm">
        <div>
          <span className="font-medium">Env check:</span>{" "}
          <span className={diag.apiKeyOk ? "text-green-600" : "text-red-600"}>
            API Key {diag.apiKeyOk ? "loaded" : "missing"}
          </span>{" "}
          ·{" "}
          <span className={diag.clientIdOk ? "text-green-600" : "text-red-600"}>
            OAuth Client ID {diag.clientIdOk ? "loaded" : "missing"}
          </span>
        </div>
        {!diag.apiKeyOk || !diag.clientIdOk ? (
          <p className="mt-2 text-muted-foreground">
            If either is missing, add{" "}
            <code className="px-1 py-0.5 rounded bg-muted">NEXT_PUBLIC_GOOGLE_API_KEY</code> and{" "}
            <code className="px-1 py-0.5 rounded bg-muted">NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID</code>{" "}
            in your Vercel Project &rarr; Settings &rarr; Environment Variables, then redeploy.
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <DrivePickerButton
          onPicked={(r) => {
            setError(null)
            setResult(r)
          }}
        >
          Pick / Upload Image
        </DrivePickerButton>

        <button
          type="button"
          className="rounded-md border px-3 py-2 hover:bg-muted"
          onClick={() => {
            setResult(null)
            setError(null)
          }}
        >
          Clear
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <div className="text-sm">
            <div>
              <span className="font-medium">File ID:</span> <code>{result.fileId}</code>
            </div>
            <div className="break-all">
              <span className="font-medium">Public URL:</span>{" "}
              <a className="text-primary underline" href={result.publicUrl} target="_blank" rel="noreferrer">
                {result.publicUrl}
              </a>
            </div>
          </div>
          <img
            src={result.publicUrl}
            alt="Picked file preview"
            className="max-w-sm rounded-lg border"
          />
        </div>
      )}
    </div>
  )
}
