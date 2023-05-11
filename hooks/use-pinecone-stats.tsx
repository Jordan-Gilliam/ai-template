import useSWR from "swr"

export const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json())

export const usePineconeStats = () => {
  const { data, error, isLoading } = useSWR("/api/stats", fetcher, {
    revalidateOnFocus: true,
  })

  return {
    loading: isLoading,
    data,
    error,
  }
}

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
