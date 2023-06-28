import { useCallback, useState } from "react"

export const useToggle = (initialState: boolean = false): [boolean, any] => {
  // Initialize the state
  const [state, setState] = useState<boolean>(initialState)
  // Define and memoize toggler function in case we pass down the component,
  const toggle = useCallback((): void => setState((state) => !state), [])
  return [state, toggle]
}
