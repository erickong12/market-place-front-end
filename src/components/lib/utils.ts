import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const money = (n: number | string = 0, currency: string = "IDR", locale: string = "en-US"): string => {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
    }).format(Number(n));
};
