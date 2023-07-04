import { Check, Eraser, ChevronDown } from "lucide-react";
import { useState } from "react";
import { State_Map } from "./map/usa";
import { stateList } from "./shared/useStateParams";
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
  return stateList.map((state) => {
    return {
      value: State_Map[state].id.toLowerCase(),
      label: state,
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
  if (!value) {
    return <span>search states...</span>;
  }

  const state = states.find(
    (state) => state.value.toLowerCase() === value.toLowerCase()
  );

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
          className="group mb-2 w-[200px] justify-between text-zinc-700 transition-all duration-300"
        >
          <StateLabel value={searchParams.state || ""} states={states} />
          <ChevronDown
            className={cn(
              "ml-2 inline-block h-4 w-4 shrink-0 opacity-50 transition-transform duration-300 ease-out group-focus:translate-y-[1.5px]",
              open ? "rotate-180 duration-100" : ""
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            placeholder="Search states..."
            className="text-zinc-700"
          />
          <CommandEmpty>No state found.</CommandEmpty>
          <CommandGroup className="max-h-48">
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
