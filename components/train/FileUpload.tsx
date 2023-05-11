import React, { useCallback, useState } from "react"
import { Document } from "langchain/document"
import { File } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { cn, truncateLongFileName } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { GlowButton } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"

export type Message = {
  type: "apiMessage" | "userMessage"
  message: string
  isStreaming?: boolean
  sourceDocs?: Document[]
}

export function FileUpload({ namespace }) {
  const [files, setFiles] = useState(null)
  const [status, setStatus] = useState("idle")

  const onDrop = useCallback((acceptedFiles) => {
    setStatus("new-file")
    setFiles(acceptedFiles)
  }, [])

  const handleUpload = useCallback(async () => {
    setStatus("loading")
    if (!namespace) {
      return toast({
        title: "Please enter a pinecone namespace",
      })
    }
    const formData = new FormData()
    Array.from(files).forEach((file: File) => {
      formData.append("file", file)
    })

    try {
      await fetch("/api/embed-file", {
        method: "post",
        body: formData,
        headers: {
          namespace: !!namespace ? namespace : "default-namespace",
        },
      })
      setStatus("complete")

      return toast({
        title: "✅ Success! ",
        description: `Uploaded ${files[0].name} in namespace: ${namespace}`,
      })
    } catch (e) {
      setStatus("error")
      return toast({
        title: "❌ Error! ",
        description: `${e}`,
      })
    }
  }, [files])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/json": [".json"],
      "text/plain": [".txt", ".md"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "text/html": [".html"],
    },
    multiple: false,
    maxFiles: 1,
  })

  return (
    <div className="flex h-48 flex-col items-center">
      <div
        className={cn(
          "min-w-[300px] cursor-pointer  p-6 text-neutral-800  ",
          " input-shadow rounded-lg  !outline-none",
          "relative border border-black/5 bg-white px-7  text-base shadow-black/5  placeholder:text-neutral-400 ",
          " dark:bg-black/90 dark:text-neutral-200 dark:shadow-black/10 dark:placeholder:text-neutral-500 dark:focus:bg-neutral-950/60"
        )}
        {...getRootProps()}
      >
        <div className=" flex items-center justify-center">
          {files ? (
            <div className="flex flex-col text-center">
              <p className="text-neutral-700 dark:text-neutral-400/80">
                Selected File
              </p>
              <p>{truncateLongFileName(files[0].name) ?? "file name error"}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-sm ">
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p className="flex-wrap px-6 text-center">
                  Supports
                  <br />
                  .txt .pdf .docx .md .png .jpg .html
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex  cursor-pointer items-center justify-center ">
          <File className="mt-3 h-5 w-5  stroke-neutral-800 dark:stroke-neutral-400/80" />
          <input {...getInputProps()} className="h-full" />
        </div>
      </div>

      <div className="mt-auto ">
        <LoadingButton
          status={status}
          handleSubmit={handleUpload}
          disabled={!files || status === "idle"}
        />
      </div>
    </div>
  )
}

function LoadingButton({ handleSubmit, disabled, status }) {
  return (
    <GlowButton
      disabled={disabled}
      className=""
      variant="ghost"
      onClick={handleSubmit}
    >
      <div className="flex w-full items-center px-6 py-1">
        {status === "loading" ? (
          <Icons.loadingSpinner className="mr-2 h-5 w-5 animate-spin stroke-teal-500/80  dark:stroke-teal-400 " />
        ) : status === "complete" ? (
          <Icons.check className="mr-2 h-5 w-5" />
        ) : (
          <Icons.upload className="mr-2 h-5 w-5" aria-hidden="true" />
        )}
        <span>Upload</span>
      </div>
    </GlowButton>
  )
}
