import { motion } from "framer-motion"
import useMeasure from "react-use-measure"

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 3.5 } },
  exit: { opacity: 0, transition: { duration: 0.02 } },
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.5,
    },
  },
}

const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

export default function ResizablePanel({
  children,
}: {
  children: React.ReactNode
}) {
  let [ref, { height }] = useMeasure()

  // const show =   {height ? { height } : {}}

  return (
    // <motion.div
    // animate={height ? { height } : {}}
    //   style={height ? { height } : {}}
    //   className="relative w-full overflow-hidden"
    //   transition={{ type: "tween", duration: 0.5 }}
    // >
    <motion.div
      animate={height ? { height } : {}}
      style={height ? { height } : {}}
      variants={fadeIn}
      // animate=""
      className="relative w-full overflow-hidden"
      // transition={{ type: "tween", duration: 2.5 }}
      // transition={{ ease: [0.17, 0.67, 0.83, 0.67] }}
    >
      <div
        ref={ref}
        // variants={item}
        className={height ? "absolute inset-x-0" : "relative"}
      >
        {children}
      </div>
    </motion.div>
  )
}
