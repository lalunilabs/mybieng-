"use client";

import * as React from "react";
import * as RadixLabel from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof RadixLabel.Root> {
  hint?: string;
}

export const Label = React.forwardRef<
  React.ElementRef<typeof RadixLabel.Root>,
  LabelProps
>(({ className, children, hint, ...props }, ref) => (
  <RadixLabel.Root
    ref={ref}
    className={cn(
      "block text-sm font-medium text-gray-700",
      className
    )}
    {...props}
  >
    {children}
    {hint ? (
      <span className="ml-2 text-xs text-gray-500">{hint}</span>
    ) : null}
  </RadixLabel.Root>
));
Label.displayName = "Label";

export default Label;
