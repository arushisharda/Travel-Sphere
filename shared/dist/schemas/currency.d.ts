import { z } from 'zod';
export declare const SUPPORTED_CURRENCIES: readonly ["USD", "INR", "EUR", "GBP", "JPY", "CAD", "AUD"];
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];
export declare const convertQuerySchema: z.ZodObject<{
    amount: z.ZodNumber;
    from: z.ZodEnum<["USD", "INR", "EUR", "GBP", "JPY", "CAD", "AUD"]>;
    to: z.ZodEnum<["USD", "INR", "EUR", "GBP", "JPY", "CAD", "AUD"]>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    from: "USD" | "INR" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD";
    to: "USD" | "INR" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD";
}, {
    amount: number;
    from: "USD" | "INR" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD";
    to: "USD" | "INR" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD";
}>;
export type ConvertQuery = z.infer<typeof convertQuerySchema>;
//# sourceMappingURL=currency.d.ts.map