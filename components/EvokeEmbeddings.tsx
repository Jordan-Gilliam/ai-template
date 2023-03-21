import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Toaster, toast } from "react-hot-toast"
import useMeasure from "react-use-measure"
import ResizablePanel from "@/components/ResizablePanel"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useGenerateEmbeddings } from "@/hooks/use-generate-embeddings"

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 3.5 } },
  exit: { opacity: 0, transition: { duration: 0.02 } },
}

export function EvokeEmbeddings() {
  let [ref, { height }] = useMeasure()
  const [urls, setUrls] = useState<string[]>([])

  const { loading, trigger } = useGenerateEmbeddings()

  console.log("load", loading)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!urls) {
      return toast.error("Please enter a url")
    }
    try {
      const result = await trigger({ urls })
      return result
    } catch (e) {
      return toast.error(e)
    }
  }

  return (
    <ResizablePanel>
      <AnimatePresence mode="wait">
        <motion.div
          animate={height ? { height } : {}}
          style={height ? { height } : {}}
          transition={{ type: "tween", duration: 0.5 }}
          exit="exit"
          className="m-auto mt-6 flex max-w-xl flex-col items-center pb-12 text-center"
        >
          <form onSubmit={handleSubmit}>
            <Textarea
              className=" h-[100px] min-w-[350px] max-w-3xl rounded-lg border-2 border-mauve-9  shadow-sm placeholder:text-mauve-11 md:min-w-[450px] "
              placeholder="https://en.wikipedia.org/wiki/Manly_P._Hall, "
              value={urls.join("\n")}
              onChange={(e) => setUrls(e.target.value.split("\n"))}
            />

            <Button
              disabled={loading}
              type="submit"
              className="mt-6 max-w-lg"
              variant="outline"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Evoke Embeddings
            </Button>
          </form>

          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{ duration: 2000 }}
          />
        </motion.div>
      </AnimatePresence>
    </ResizablePanel>
  )
}
