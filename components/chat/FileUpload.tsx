import React, { useCallback, useState } from "react"
import { Document } from "langchain/document"
import { Loader2, UploadCloud } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"

export type Message = {
  type: "apiMessage" | "userMessage"
  message: string
  isStreaming?: boolean
  sourceDocs?: Document[]
}

export function FileUpload() {
  const [files, setFiles] = useState(null)

  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles)
  }, [])

  const handleUpload = useCallback(async () => {
    const formData = new FormData()
    Array.from(files).forEach((file: File) => {
      formData.append("file", file)
    })

    setIsUploading(true)
    await fetch("/api/file-ingest", {
      method: "post",
      body: formData,
      // TODO: Add dynamic namespace
      // headers: {
      //   namespace: !!namespace ? namespace : "pdf-test",
      // },
    })
    setIsUploading(false)
  }, [files])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/json": [".json"],
      "text/plain": [".txt", ".md"],
    },
    multiple: false,
    maxFiles: 1,
  })

  return (
    <div className="flex max-w-3xl flex-col items-center">
      <div
        className="min-w-full rounded-md border border-slate-200 p-0 dark:border-slate-700"
        {...getRootProps()}
      >
        <div className="mt-12 flex items-center justify-center">
          {files ? (
            <p>{files[0].name}</p>
          ) : (
            <>
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>
                  Drag and drop a file(.pdf, .txt, .md) here, or click to select
                  file
                </p>
              )}
            </>
          )}
        </div>
        <div className="flex min-h-[100px] cursor-pointer items-center justify-center p-10">
          <input {...getInputProps()} />
        </div>
      </div>

      <Button
        disabled={!files || isUploading}
        onClick={handleUpload}
        className="mt-4"
      >
        {!isUploading ? (
          <UploadCloud className="mr-2 h-4 w-4" />
        ) : (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Upload
      </Button>
      {/* </div> */}

      <div className="self-start"></div>
    </div>
  )
}
