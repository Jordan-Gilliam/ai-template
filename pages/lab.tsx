import { useState } from "react"
import { EvokeEmbeddings } from "@/components/EvokeEmbeddings"
import { InvokeEmbeddings } from "@/components/InvokeEmbeddings"
import { Layout, Logo } from "@/components/Layout"
import { cn } from "@/lib/utils"
import { LayoutGroup, motion } from "framer-motion"

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

export default function LabPage() {
  const [embedding, setEmbedding] = useState("EVOKE")

  function toggleEmbedding() {
    setEmbedding(embedding === "EVOKE" ? "INVOKE" : "EVOKE")
  }

  const imageVariants = {
    rotate: {
      rotateY: 90,
    },
  }
  return (
    <Layout>
      {/* <div className="grid-col-flow grid  min-h-screen  grid-cols-12 grid-rows-3 items-center justify-center">
        <div className="col-span-4 row-span-2"> */}
      <div className="  flex min-h-screen  flex-col gap-3 ">
        <div className="my-6">
          <div className="flex items-center justify-center gap-3">
            <ToggleHeading text="EVOKE" embedding={embedding} />
            <button onClick={toggleEmbedding}>
              <motion.img
                alt={embedding}
                src={
                  embedding === "EVOKE"
                    ? "/logo-down-violet.svg"
                    : "/logo-down-pink.svg"
                }
                variants={imageVariants}
                animate={{ rotateX: embedding === "EVOKE" ? 180 : 0 }}
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

// export default function LabPage() {
//     return (
//       <Layout>
//         <Collapsible className=" flex flex-col items-center justify-center">
//           <CollapsibleTrigger>
//             <Logo path="/logo-down-violet.svg" height={250} width={250} />
//           </CollapsibleTrigger>
//           <CollapsibleContent className=" flex flex-col items-center justify-center">
//             <h1 className="my-5 font-aboreto text-2xl font-bold sm:text-4xl">
//               Evoke embeddings
//             </h1>
//             <p className="mb-6 -mt-4 max-w-xl text-base text-mauve-11">
//               Paste a list of comma separated URLs below
//             </p>
//             <EvokeEmbeddings />
//           </CollapsibleContent>
//         </Collapsible>

//         <Collapsible className=" flex flex-col items-center justify-center">
//           <CollapsibleContent className=" flex flex-col items-center justify-center">
//             <h1 className="my-6  font-aboreto text-2xl font-bold sm:text-4xl">
//               Invoke Embeddings
//             </h1>
//             <p className="mb-6 -mt-4 max-w-xl text-lg text-mauve-11">
//               This chat leverages the embedded knowledge provided by you
//             </p>
//             <InvokeEmbeddings />
//           </CollapsibleContent>
//           <CollapsibleTrigger>
//             <Logo path="/logo-down-pink.svg" rotate height={250} width={250} />
//           </CollapsibleTrigger>
//         </Collapsible>
//       </Layout>
//     )
//   }
