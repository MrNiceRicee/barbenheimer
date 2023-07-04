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
import { useStateParams } from "./shared/useStateParams";

const StateList = () => {
  return Object.entries(State_Map).map(([key, value]) => {
    return {
      value: value.id.toLowerCase(),
      label: key,
    };
  });
};

function StateLabel({
  value,
  states,
}: {
  value: string;
  states: ReturnType<typeof StateList>;
}) {
  console.log({ value });
  if (!value) {
    // return "search states...";
    return <span>search states...</span>;
  }

  const state = states.find(
    (state) => state.value.toLowerCase() === value.toLowerCase()
  );

  console.log({
    state,
  });

  // return state?.label || value;
  return <span>{state?.label || value}</span>;
}

export function StateSearch() {
  const { searchParams, setSearchParams } = useStateParams();
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
          <StateLabel value={searchParams.state || ""} states={states} />
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
            {searchParams.state && (
              <CommandItem
                onSelect={() => {
                  // setValue({ value: "", stateName: "" });
                  setSearchParams({ state: "" });
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
                // value={state.value}
                onSelect={(currentValue) => {
                  // setValue(currentValue === value ? "" : currentValue);
                  // setValue({
                  //   value: currentValue === value ? "" : currentValue,
                  //   stateName: state.label,
                  // });
                  setSearchParams({
                    state:
                      currentValue === searchParams.state ? "" : currentValue,
                  });
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    searchParams.state?.toLowerCase() ===
                      state.label.toLowerCase()
                      ? "opacity-100"
                      : "opacity-0"
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
