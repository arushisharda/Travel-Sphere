import { z } from 'zod';
export declare const tripCreateSchema: z.ZodObject<{
    destinationSlug: z.ZodString;
    title: z.ZodString;
    startDate: z.ZodOptional<z.ZodDate>;
    endDate: z.ZodOptional<z.ZodDate>;
    durationDays: z.ZodNumber;
    preferences: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    destinationSlug: string;
    durationDays: number;
    title: string;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
    preferences?: Record<string, unknown> | undefined;
}, {
    destinationSlug: string;
    durationDays: number;
    title: string;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
    preferences?: Record<string, unknown> | undefined;
}>;
export declare const tripUpdateSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodDate>;
    endDate: z.ZodOptional<z.ZodDate>;
    status: z.ZodOptional<z.ZodEnum<["DRAFT", "PLANNED", "COMPLETED"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "DRAFT" | "PLANNED" | "COMPLETED" | undefined;
    startDate?: Date | undefined;
    title?: string | undefined;
    endDate?: Date | undefined;
}, {
    status?: "DRAFT" | "PLANNED" | "COMPLETED" | undefined;
    startDate?: Date | undefined;
    title?: string | undefined;
    endDate?: Date | undefined;
}>;
export type TripCreateInput = z.infer<typeof tripCreateSchema>;
export type TripUpdateInput = z.infer<typeof tripUpdateSchema>;
//# sourceMappingURL=trip.d.ts.map