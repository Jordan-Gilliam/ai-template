import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getNamespaceKeys, usePineconeStats } from "@/hooks/use-pinecone-stats"

export function NamespaceSelector({ newNamespace, onNamespaceSelect }) {
  const [namespace, setNamespace] = useState(newNamespace)

  const { data, error } = usePineconeStats()

  const handleInputChange = (event) => {
    const inputValue = event.target.value
    setNamespace(inputValue)
    onNamespaceSelect(inputValue)
  }

  const handleDropdownChange = (selectedValue) => {
    setNamespace(selectedValue)
    onNamespaceSelect(selectedValue)
  }

  const previousNamespaces =
    !error && data && getNamespaceKeys(data.indexDescription)

  return (
    <div className="flex flex-col items-center gap-3 md:flex-row">
      <div className=" flex flex-col gap-1.5">
        <Label className=" mb-[1.75px]" htmlFor="namespace">
          namespace
        </Label>

        <Input
          value={namespace}
          onChange={handleInputChange}
          placeholder="default"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className=" mb-[1.75px]" htmlFor="namespace">
          previous
        </Label>

        <Select onValueChange={handleDropdownChange}>
          <SelectTrigger
            className={cn(
              " input-shadow h-13 w-[250px] rounded-lg !outline-none",
              "relative border border-black/5 bg-white px-7 py-3.5 text-base shadow-black/5  placeholder:text-neutral-400 ",
              " dark:bg-black/80 dark:text-white dark:shadow-black/10 dark:placeholder:text-neutral-300 dark:focus:bg-black"
            )}
          >
            <SelectValue placeholder="default" />
          </SelectTrigger>

          <SelectContent>
            {previousNamespaces &&
              previousNamespaces.map((namespace, i) => (
                <SelectItem key={`${namespace}-${i}`} value={namespace}>
                  {namespace}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
