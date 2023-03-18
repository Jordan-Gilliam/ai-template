// import styles from "../styles/loading-dots.module.css"

// export function LoadingDots({ color = "#000", style = "small" }) {
//   return (
//     <span className={style == "small" ? styles.loading2 : styles.loading}>
//       <span style={{ backgroundColor: color }} />
//       <span style={{ backgroundColor: color }} />
//       <span style={{ backgroundColor: color }} />
//     </span>
//   )
// }

export function LoadingSpinner() {
  return (
    <svg
      className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  )
}

export function LoadingChatLine() {
  return (
    <div className="flex min-w-full animate-pulse px-4 py-5 sm:px-6">
      <div className="flex grow space-x-3">
        <div className="min-w-0 flex-1">
          <p className="font-large text-xxl text-gray-900">
            <a href="#" className="hover:underline">
              AI
            </a>
          </p>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 h-2 rounded bg-zinc-500"></div>
              <div className="col-span-1 h-2 rounded bg-zinc-500"></div>
            </div>
            <div className="h-2 rounded bg-zinc-500"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
