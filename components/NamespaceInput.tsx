import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function NamespaceInput({ value, handleChange, placeholder }) {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label className=" mb-[1.75px]" htmlFor="namespace">
        namespace
      </Label>

      <Input
        // id="namespace"
        value={value}
        onChange={handleChange}
        // type="text"
        placeholder={placeholder}
      />
    </div>
  )
}
