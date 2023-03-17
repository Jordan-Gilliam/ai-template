import React, { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export const FancyBackground: React.FC<Props> = ({ children }) => {
  return (
    <div className="relative z-0 min-h-screen">
      <div className="absolute inset-0 -z-10 overflow-hidden ">
        <div className=" fancy-bg2 absolute top-0 bottom-0 left-1/2 w-[100vw] min-w-[1500px] -translate-x-1/2 bg-no-repeat" />
      </div>
      {children}
    </div>
  )
}
