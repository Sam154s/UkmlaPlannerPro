import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Omit the onChange from HTML input props since we'll provide our own
interface TimePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  onChange: (time: string) => void;
  value: string;
}

export function TimePicker({ label, onChange, value, className, ...props }: TimePickerProps) {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={cn("space-y-1", className)}>
      {label && <Label className="text-xs text-muted-foreground">{label}</Label>}
      <Input
        type="time"
        value={value}
        onChange={handleTimeChange}
        className="h-8 text-sm"
        {...props}
      />
    </div>
  );
}