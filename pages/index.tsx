import { useState } from "react"
import { LayoutGroup, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card } from "@/components/Card"
import { PageLayout } from "@/components/Layouts"
import { NamespaceInput } from "@/components/NamespaceInput"
import { PineconeQuery } from "@/components/query/PineconeQuery"
import { FileUpload } from "@/components/train/FileUpload"
import { UrlScraper } from "@/components/train/UrlScraper"

function ToggleHeading({ text, embedding }) {
  const activeHeading = text == embedding
  return (
    <h1
      className={cn(
        " my-6 font-aboreto text-3xl transition duration-300 sm:text-6xl",
        activeHeading ? "text-mauve-12" : "text-mauve-8"
      )}
    >
      {text}
    </h1>
  )
}

export default function Pinecone() {
  const [embedding, setEmbedding] = useState("TRAIN")
  const [namespace, setNamespace] = useState("")
  const [animateOnce, setAnimateOnce] = useState(true)

  function toggleEmbedding() {
    setEmbedding(embedding === "TRAIN" ? "QUERY" : "TRAIN")
    setAnimateOnce(false)
  }

  const imageVariants = {
    rotate: {
      rotateY: 90,
    },
  }

  return (
    <PageLayout>
      <div className="  flex flex-col items-center gap-3  px-3 ">
        <div className="my-6">
          <div className="flex items-center justify-center md:gap-3">
            <ToggleHeading text="TRAIN" embedding={embedding} />
            <button
              className="transition duration-150 hover:scale-105"
              onClick={toggleEmbedding}
            >
              <motion.img
                className={cn(animateOnce ? "animate-pulse" : "")}
                alt={embedding}
                src={
                  embedding === "TRAIN"
                    ? "/merc-logo-down-aqua.webp"
                    : "/merc-logo-down-aqua.webp"
                }
                variants={imageVariants}
                animate={{ rotateX: embedding === "TRAIN" ? 0 : 180 }}
                height={175}
                width={175}
              />
            </button>

            <div className="flex flex-col items-center justify-center">
              <ToggleHeading text="QUERY" embedding={embedding} />
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col items-center">
          <div className="mb-5 items-center md:max-w-2xl">
            <div className="w-full">
              <NamespaceInput
                value={namespace}
                handleChange={(e) => setNamespace(e.target.value)}
                placeholder="default"
              />
            </div>
          </div>
          <LayoutGroup>
            <motion.div className=" flex w-full flex-col items-center  ">
              {embedding === "TRAIN" ? (
                <>
                  <p className=" mt-2  max-w-lg text-center text-neutral-800 dark:text-neutral-200 md:text-lg">
                    Set a pinecone <span className="font-bold"> namespace</span>{" "}
                    and create vector embeddings by
                    <span className="font-bold"> uploading</span> files or{" "}
                    <span className="font-bold"> sraping</span> websites
                  </p>
                  <div className="flex flex-col items-center justify-between md:mt-6 md:flex-row md:items-start ">
                    <div className="  pt-4 md:mx-4 md:mt-0 md:max-w-2xl">
                      <div className="  w-full">
                        <Card
                          cardDetails={{
                            name: "Upload",
                            description:
                              "Upload your pdf to Pinecone as a vector",
                          }}
                        >
                          <FileUpload namespace={namespace} />
                        </Card>
                      </div>
                    </div>

                    <div className=" px-6 pt-4 md:mx-4 md:mt-0 md:max-w-2xl">
                      <div className=" w-full">
                        <Card
                          cardDetails={{
                            name: "Scrape",
                            description: "Scrape URLs to generate embeddings",
                          }}
                        >
                          <UrlScraper namespace={namespace} />
                        </Card>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className=" flex w-full flex-col items-center ">
                  <p className="mb-3 mt-2 max-w-lg text-center text-neutral-800 dark:text-neutral-200 md:text-lg">
                    Query your newly trained ai. Leverage the embedded knowledge
                    provided by you.
                    <span className="font-bold"> Training</span>
                  </p>

                  <PineconeQuery namespace={namespace} />
                </div>
              )}
            </motion.div>
          </LayoutGroup>
        </div>
      </div>
    </PageLayout>
  )
}
