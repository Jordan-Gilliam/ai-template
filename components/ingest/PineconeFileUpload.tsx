import React, { useCallback, useState } from "react"
import { Document } from "langchain/document"
import { File, Loader2, UploadCloud } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type Message = {
  type: "apiMessage" | "userMessage"
  message: string
  isStreaming?: boolean
  sourceDocs?: Document[]
}

export function PineconeFileUpload({ namespace }) {
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
    await fetch("/api/pinecone-ingest-file", {
      method: "post",
      body: formData,
      headers: {
        namespace: !!namespace ? namespace : "default-namespace",
      },
    })
    setIsUploading(false)
  }, [files])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      // "application/json": [".json"],
      // "text/plain": [".txt", ".md"],
    },
    multiple: false,
    maxFiles: 1,
  })

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "min-w-full cursor-pointer rounded-xl border-2 p-6 text-mauve-12  ",
          "shadow-sm ring-1 ring-inset ring-mauve-2 placeholder:text-mauve-11",
          "focus:bg-mauve-1 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-mauve-2",
          "disabled:cursor-not-allowed disabled:opacity-50 dark:border-black dark:text-mauve-12 sm:leading-6  md:text-xl"
        )}
        {...getRootProps()}
      >
        <div className=" flex items-center justify-center">
          {files ? (
            <p>{files[0].name}</p>
          ) : (
            <div className="flex flex-col items-center justify-center ">
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p className="px-6">Drag and drop pdf file here</p>
              )}
              <File className="mt-6 h-8 w-8 stroke-mauve-8" />
            </div>
          )}
        </div>
        <div className="flex  cursor-pointer items-center justify-center ">
          <input {...getInputProps()} className="h-full" />
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
