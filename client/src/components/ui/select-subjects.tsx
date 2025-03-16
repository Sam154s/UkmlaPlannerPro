import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface SelectSubjectsProps {
  subjects: string[];
  selectedSubjects: string[];
  onChange: (selected: string[]) => void;
  maxSelections?: number;
}

export function SelectSubjects({
  subjects,
  selectedSubjects,
  onChange,
  maxSelections = 5
}: SelectSubjectsProps) {
  const [open, setOpen] = useState(false);

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      onChange(selectedSubjects.filter((s) => s !== subject));
    } else if (selectedSubjects.length < maxSelections) {
      onChange([...selectedSubjects, subject]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedSubjects.length === 0
            ? "Select favorite subjects..."
            : `${selectedSubjects.length} subject${selectedSubjects.length === 1 ? '' : 's'} selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" style={{ maxHeight: '300px', overflow: 'auto' }}>
        <Command>
          <CommandInput placeholder="Search subjects..." />
          <CommandEmpty>No subject found.</CommandEmpty>
          <CommandGroup className="max-h-[250px] overflow-y-auto">
            {subjects.map((subject) => (
              <CommandItem
                key={subject}
                value={subject}
                onSelect={() => {
                  toggleSubject(subject);
                  setOpen(true);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedSubjects.includes(subject) ? "opacity-100" : "opacity-0"
                  )}
                />
                {subject}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}