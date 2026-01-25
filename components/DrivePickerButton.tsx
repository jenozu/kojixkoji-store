"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    gapi: any
    google: any
    _gisReady?: boolean
    _gapiReady?: boolean
  }
}

type Props = {
  onPicked: (result: { fileId: string; publicUrl: string }) => void
  children?: React.ReactNode
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY! // Vercel env
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID! // Vercel env
const SCOPE = "https://www.googleapis.com/auth/drive.file"

/**
 * Load a script only once.
 */
function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement("script")
    s.src = src
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

export default function DrivePickerButton({ onPicked, children }: Props) {
  const booted = useRef(false)

  useEffect(() => {
    if (booted.current) return
    booted.current = true

    ;(async () => {
      // 1) Load Google APIs (Picker lives here)
      await loadScript("https://apis.google.com/js/api.js")
      await new Promise<void>((r) => window.gapi.load("client:picker", () => r()))
      await window.gapi.client.init({ apiKey: API_KEY })

      // 2) Load GIS (new OAuth)
      await loadScript("https://accounts.google.com/gsi/client")
      window._gisReady = true
    })().catch((err) => {
      console.error("Failed to initialize Google Picker:", err)
    })
  }, [])

  /**
   * Request an access token using GIS (no deprecated gapi.auth2).
   */
  const getAccessToken = async (): Promise<string> => {
    if (!window._gisReady || !window.google?.accounts?.oauth2) {
      throw new Error("Google Identity Services not ready yet.")
    }

    return new Promise<string>((resolve, reject) => {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPE,
          callback: (resp: any) => {
            if (resp && resp.access_token) resolve(resp.access_token)
            else reject(new Error("No access token returned"))
          },
        })
        tokenClient.requestAccessToken()
      } catch (e) {
        reject(e)
      }
    })
  }

  const openPicker = async () => {
    try {
      const token = await getAccessToken()

      // Views
      const docsView = new window.google.picker.DocsView()
        .setIncludeFolders(false)
        .setSelectFolderEnabled(false)

      const uploadView = new window.google.picker.DocsUploadView()

      // Build picker
      const picker = new window.google.picker.PickerBuilder()
        .addView(docsView)
        .addView(uploadView)
        .enableFeature(window.google.picker.Feature.SIMPLE_UPLOAD_ENABLED)
        .setOAuthToken(token)
        .setDeveloperKey(API_KEY)
        .setCallback(async (data: any) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const fileId = data.docs?.[0]?.id as string
            if (!fileId) return

            // Move to your folder + make public (server route)
            const res = await fetch("/api/drive/move-to-folder", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fileId }),
            })
            const json = await res.json()
            if (json.ok) onPicked({ fileId, publicUrl: json.publicUrl })
            else alert("Could not prepare image: " + (json.error || "unknown error"))
          }
        })
        .build()

      picker.setVisible(true)
    } catch (err: any) {
      console.error("Picker error:", err)
      alert(err?.message || "Failed to open Google Picker")
    }
  }

  return (
    <button
      type="button"
      onClick={openPicker}
      className="inline-flex items-center gap-2 rounded-md border px-3 py-2 hover:bg-muted"
    >
      {children ?? "Pick / Upload Image"}
    </button>
  )
}
