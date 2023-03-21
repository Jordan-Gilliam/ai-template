import { useState } from "react"
import { LayoutGroup, motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { EvokeEmbeddings } from "@/components/EvokeEmbeddings"
import { InvokeEmbeddings } from "@/components/InvokeEmbeddings"
import { Layout } from "@/components/Layout"

function ToggleHeading({ text, embedding }) {
  const activeHeading = text == embedding
  return (
    <h1
      className={cn(
        " my-6 font-aboreto text-2xl transition duration-300 sm:text-6xl",
        activeHeading ? "text-mauve-12" : "text-mauve-8"
      )}
    >
      {text}
    </h1>
  )
}

export default function DomainSpecificEmbeddingPage() {
  const [embedding, setEmbedding] = useState("EVOKE")
  const [animateOnce, setAnimateOnce] = useState(true)

  function toggleEmbedding() {
    setEmbedding(embedding === "EVOKE" ? "INVOKE" : "EVOKE")
    setAnimateOnce(false)
  }

  const imageVariants = {
    rotate: {
      rotateY: 90,
    },
  }

  return (
    <Layout>
      <div className="  flex min-h-screen  flex-col gap-3 px-3">
        <div className="my-6">
          <div className="flex items-center justify-center gap-3">
            <ToggleHeading text="EVOKE" embedding={embedding} />
            <button
              className="transition duration-150 hover:scale-105"
              onClick={toggleEmbedding}
            >
              <motion.img
                className={cn(animateOnce ? "animate-pulse" : "")}
                alt={embedding}
                src={
                  embedding === "EVOKE"
                    ? "/merc-logo-down-purple.webp"
                    : "/merc-logo-down-aqua.webp"
                }
                variants={imageVariants}
                animate={{ rotateX: embedding === "EVOKE" ? 0 : 180 }}
                height={250}
                width={250}
              />
            </button>

            <div className="flex flex-col items-center justify-center">
              <ToggleHeading text="INVOKE" embedding={embedding} />
            </div>
          </div>
        </div>

        <div className="col-span-8 row-span-3 items-center justify-center">
          <LayoutGroup>
            <motion.div className=" flex w-full flex-col items-center justify-center">
              {embedding === "EVOKE" ? (
                <div className="">
                  <p className="mb-6 -mt-4 max-w-xl text-center text-lg text-mauve-12">
                    Paste a list of comma separated URLs below to generate
                    embeddings using the OpenAI API, and add the embeddings to
                    the Supabase embeddings table.
                  </p>
                  <EvokeEmbeddings />
                </div>
              ) : (
                <div className=" w-full ">
                  <p className="mb-6 -mt-4  text-center text-lg text-mauve-12">
                    This chat leverages the embedded knowledge provided by you
                  </p>

                  <InvokeEmbeddings />
                </div>
              )}
            </motion.div>
          </LayoutGroup>
        </div>
      </div>
    </Layout>
  )
}
