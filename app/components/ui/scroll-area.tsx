import * as React from "react";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => (
    <div className={"relative overflow-hidden " + (className ?? "")} {...props}>
      <div
        ref={ref}
        className="h-full w-full overflow-y-auto overflow-x-hidden no-scrollbar"
      >
        {children}
      </div>
    </div>
  )
);
ScrollArea.displayName = "ScrollArea";
