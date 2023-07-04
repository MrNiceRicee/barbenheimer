import { ChevronsUpDown, Check, Eraser } from "lucide-react";
import { useState } from "react";
import { State_Map } from "./map/usa";
import { Button } from "~/components/ui/Button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

const StateList = () => {
  return Object.entries(State_Map).map(([key, value]) => {
    return {
      value: value.id.toLowerCase(),
      label: key,
    };
  });
};

export function StateSearch({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const states = StateList();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="mb-2 w-[200px] justify-between text-zinc-700"
        >
          <span>
            {value
              ? states.find(
                  (state) => state.label.toLowerCase() === value.toLowerCase()
                )?.label
              : "search states..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search states..."
            className="text-zinc-700"
          />
          <CommandEmpty>No state found.</CommandEmpty>
          <CommandGroup>
            {value && (
              <CommandItem
                onSelect={() => {
                  setValue("");
                  setOpen(false);
                }}
              >
                <Eraser className="mr-2 h-4 w-4" />
                Clear
              </CommandItem>
            )}
            {states.map((state) => (
              <CommandItem
                key={state.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === state.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {state.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
