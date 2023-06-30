import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import useMeasure from "react-use-measure"

let transition = { type: "ease", ease: "easeInOut", duration: 0.4 }

export function ResizablePanel({ content, children }) {
  let [ref, bounds] = useMeasure()

  return (
    <MotionConfig transition={transition}>
      <motion.div
        animate={{ height: bounds.height > 0 ? bounds.height : null }}
        transition={{ type: "spring", bounce: 0.1, duration: 0.3 }}
      >
        <div ref={ref}>
          <AnimatePresence mode="popLayout">
            {content ? (
              <motion.div
                exit={{ opacity: 0 }}
                transition={{
                  ...transition,
                  duration: transition.duration / 2,
                }}
                key="form"
              >
                <div className="w-full">{children}</div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  ...transition,
                  duration: transition.duration / 2,
                  delay: transition.duration / 2,
                }}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </MotionConfig>
  )
}
