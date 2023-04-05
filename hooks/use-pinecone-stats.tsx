import useSWR from "swr"

// @ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json())

interface IndexDescription {
  namespaces: {
    [key: string]: {
      vectorCount: number
    }
  }
  dimension: number
  indexFullness: number
  totalVectorCount: number
}

export const getNamespaceKeys = (
  indexDescription: IndexDescription
): string[] => {
  return Object.keys(indexDescription.namespaces)
}

export const usePineconeStats = () => {
  const { data, error, isLoading } = useSWR("/api/stats", fetcher)

  return {
    loading: isLoading,
    data,
    error,
  }
}
