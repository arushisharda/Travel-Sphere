import { z } from 'zod';
export declare const travelPreferenceSchema: z.ZodObject<{
    climate: z.ZodOptional<z.ZodEnum<["temperate", "tropical", "arid", "alpine", "mediterranean"]>>;
    budgetLevel: z.ZodOptional<z.ZodNumber>;
    pace: z.ZodOptional<z.ZodEnum<["relaxed", "balanced", "packed"]>>;
    interests: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    foodPrefs: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    interests: string[];
    pace?: "relaxed" | "balanced" | "packed" | undefined;
    budgetLevel?: number | undefined;
    climate?: "temperate" | "tropical" | "arid" | "alpine" | "mediterranean" | undefined;
    foodPrefs?: string | undefined;
}, {
    interests?: string[] | undefined;
    pace?: "relaxed" | "balanced" | "packed" | undefined;
    budgetLevel?: number | undefined;
    climate?: "temperate" | "tropical" | "arid" | "alpine" | "mediterranean" | undefined;
    foodPrefs?: string | undefined;
}>;
export type TravelPreferenceInput = z.infer<typeof travelPreferenceSchema>;
//# sourceMappingURL=preferences.d.ts.map