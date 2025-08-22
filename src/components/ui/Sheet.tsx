import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;
export const SheetPortal = Dialog.Portal;

export const SheetOverlay = React.forwardRef<
    React.ComponentRef<typeof Dialog.Overlay>,
    React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
    <Dialog.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm",
            "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
            className
        )}
        {...props}
    />
));
SheetOverlay.displayName = Dialog.Overlay.displayName;

type Side = "left" | "right" | "top" | "bottom";

const sideClasses: Record<Side, string> = {
    right: "right-0 top-0 h-full w-3/4 max-w-sm translate-x-full data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full",
    left: "left-0 top-0 h-full w-3/4 max-w-sm -translate-x-full data-[state=open]:translate-x-0 data-[state=closed]:-translate-x-full",
    top: "top-0 left-0 w-full h-1/3 -translate-y-full data-[state=open]:translate-y-0 data-[state=closed]:-translate-y-full",
    bottom: "bottom-0 left-0 w-full h-1/3 translate-y-full data-[state=open]:translate-y-0 data-[state=closed]:translate-y-full",
};

export const SheetContent = React.forwardRef<
    React.ComponentRef<typeof Dialog.Content>,
    React.ComponentPropsWithoutRef<typeof Dialog.Content> & { side?: Side }
>(({ side = "right", className, children, ...props }, ref) => (
    <SheetPortal>
        <SheetOverlay
            ref={ref}
            className={cn(
                "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out",
                "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
                className
            )}
            {...props}
        />
        <Dialog.Content
            ref={ref}
            className={cn(
                "fixed z-50 bg-white shadow-lg transition-transform duration-300 ease-in-out",
                sideClasses[side],
                className
            )}
            {...props}
        >
            <SheetClose asChild>
                <button
                    className="absolute right-4 top-4 rounded-md p-2 text-gray-500 hover:text-gray-900 focus:outline-none"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>
            </SheetClose>
            {children}
        </Dialog.Content>
    </SheetPortal>
));
SheetContent.displayName = Dialog.Content.displayName;
