import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import useMeasure from "react-use-measure"
import ResizablePanel from "@/components/ResizablePanel"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useGenerateEmbeddings } from "@/hooks/use-generate-embeddings"
import { toast } from "@/hooks/use-toast"

export function EvokeEmbeddings() {
  let [ref, { height }] = useMeasure()
  const [urls, setUrls] = useState<string[]>([])

  const { loading, trigger } = useGenerateEmbeddings()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!urls) {
      return toast({
        title: "Please enter a url",
      })
    }
    try {
      const result = await trigger({ urls })
      return result
    } catch (e) {
      return toast({
        title: "Uh oh! Something went wrong.",
        description: e,
      })
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
        </motion.div>
      </AnimatePresence>
    </ResizablePanel>
  )
}
