import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type FilterOption = {
  label: string
  value: string
}

export function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
  triggerClassName = "w-full sm:w-48",
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  options: FilterOption[]
  triggerClassName?: string
}) {
  const selectedOption = options.find((option) => option.value === value)

  return (
    <Select
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue !== null) {
          onChange(nextValue)
        }
      }}
    >
      <SelectTrigger className={triggerClassName} size="sm">
        <SelectValue placeholder={placeholder}>
          {selectedOption?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
