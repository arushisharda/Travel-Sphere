import { z } from 'zod';
export declare const plannerInputSchema: z.ZodObject<{
    destinationSlug: z.ZodOptional<z.ZodString>;
    city: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    durationDays: z.ZodNumber;
    startDate: z.ZodOptional<z.ZodDate>;
    interests: z.ZodDefault<z.ZodArray<z.ZodEnum<["culture", "food", "adventure", "relaxation", "nightlife", "nature", "shopping", "history"]>, "many">>;
    pace: z.ZodDefault<z.ZodEnum<["relaxed", "balanced", "packed"]>>;
    budgetLevel: z.ZodOptional<z.ZodNumber>;
    budgetCurrency: z.ZodDefault<z.ZodEnum<["USD", "INR", "EUR", "GBP", "JPY", "CAD", "AUD"]>>;
    dietaryPreferences: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    durationDays: number;
    interests: ("culture" | "food" | "adventure" | "relaxation" | "nightlife" | "nature" | "shopping" | "history")[];
    pace: "relaxed" | "balanced" | "packed";
    budgetCurrency: "USD" | "INR" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD";
    dietaryPreferences: string[];
    destinationSlug?: string | undefined;
    city?: string | undefined;
    country?: string | undefined;
    startDate?: Date | undefined;
    budgetLevel?: number | undefined;
    notes?: string | undefined;
}, {
    durationDays: number;
    destinationSlug?: string | undefined;
    city?: string | undefined;
    country?: string | undefined;
    startDate?: Date | undefined;
    interests?: ("culture" | "food" | "adventure" | "relaxation" | "nightlife" | "nature" | "shopping" | "history")[] | undefined;
    pace?: "relaxed" | "balanced" | "packed" | undefined;
    budgetLevel?: number | undefined;
    budgetCurrency?: "USD" | "INR" | "EUR" | "GBP" | "JPY" | "CAD" | "AUD" | undefined;
    dietaryPreferences?: string[] | undefined;
    notes?: string | undefined;
}>;
export declare const activitySchema: z.ZodObject<{
    timeBlock: z.ZodEnum<["MORNING", "AFTERNOON", "EVENING"]>;
    title: z.ZodString;
    description: z.ZodDefault<z.ZodString>;
    category: z.ZodDefault<z.ZodEnum<["food", "sight", "culture", "transport", "rest", "activity"]>>;
    estimatedCost: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
    currencyCode: z.ZodDefault<z.ZodNullable<z.ZodString>>;
    caveat: z.ZodDefault<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    timeBlock: "MORNING" | "AFTERNOON" | "EVENING";
    title: string;
    description: string;
    category: "culture" | "food" | "sight" | "transport" | "rest" | "activity";
    estimatedCost: number | null;
    currencyCode: string | null;
    caveat: string | null;
}, {
    timeBlock: "MORNING" | "AFTERNOON" | "EVENING";
    title: string;
    description?: string | undefined;
    category?: "culture" | "food" | "sight" | "transport" | "rest" | "activity" | undefined;
    estimatedCost?: number | null | undefined;
    currencyCode?: string | null | undefined;
    caveat?: string | null | undefined;
}>;
export declare const itineraryDraftSchema: z.ZodObject<{
    summary: z.ZodDefault<z.ZodString>;
    days: z.ZodArray<z.ZodObject<{
        dayNumber: z.ZodNumber;
        theme: z.ZodDefault<z.ZodString>;
        activities: z.ZodArray<z.ZodObject<{
            timeBlock: z.ZodEnum<["MORNING", "AFTERNOON", "EVENING"]>;
            title: z.ZodString;
            description: z.ZodDefault<z.ZodString>;
            category: z.ZodDefault<z.ZodEnum<["food", "sight", "culture", "transport", "rest", "activity"]>>;
            estimatedCost: z.ZodDefault<z.ZodNullable<z.ZodNumber>>;
            currencyCode: z.ZodDefault<z.ZodNullable<z.ZodString>>;
            caveat: z.ZodDefault<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            timeBlock: "MORNING" | "AFTERNOON" | "EVENING";
            title: string;
            description: string;
            category: "culture" | "food" | "sight" | "transport" | "rest" | "activity";
            estimatedCost: number | null;
            currencyCode: string | null;
            caveat: string | null;
        }, {
            timeBlock: "MORNING" | "AFTERNOON" | "EVENING";
            title: string;
            description?: string | undefined;
            category?: "culture" | "food" | "sight" | "transport" | "rest" | "activity" | undefined;
            estimatedCost?: number | null | undefined;
            currencyCode?: string | null | undefined;
            caveat?: string | null | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        dayNumber: number;
        theme: string;
        activities: {
            timeBlock: "MORNING" | "AFTERNOON" | "EVENING";
            title: string;
            description: string;
            category: "culture" | "food" | "sight" | "transport" | "rest" | "activity";
            estimatedCost: number | null;
            currencyCode: string | null;
            caveat: string | null;
        }[];
    }, {
        dayNumber: number;
        activities: {
            timeBlock: "MORNING" | "AFTERNOON" | "EVENING";
            title: string;
            description?: string | undefined;
            category?: "culture" | "food" | "sight" | "transport" | "rest" | "activity" | undefined;
            estimatedCost?: number | null | undefined;
            currencyCode?: string | null | undefined;
            caveat?: string | null | undefined;
        }[];
        theme?: string | undefined;
    }>, "many">;
    foodSuggestions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    culturalTips: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    assumptions: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    summary: string;
    days: {
        dayNumber: number;
        theme: string;
        activities: {
            timeBlock: "MORNING" | "AFTERNOON" | "EVENING";
            title: string;
            description: string;
            category: "culture" | "food" | "sight" | "transport" | "rest" | "activity";
            estimatedCost: number | null;
            currencyCode: string | null;
            caveat: string | null;
        }[];
    }[];
    foodSuggestions: string[];
    culturalTips: string[];
    assumptions: string[];
}, {
    days: {
        dayNumber: number;
        activities: {
            timeBlock: "MORNING" | "AFTERNOON" | "EVENING";
            title: string;
            description?: string | undefined;
            category?: "culture" | "food" | "sight" | "transport" | "rest" | "activity" | undefined;
            estimatedCost?: number | null | undefined;
            currencyCode?: string | null | undefined;
            caveat?: string | null | undefined;
        }[];
        theme?: string | undefined;
    }[];
    summary?: string | undefined;
    foodSuggestions?: string[] | undefined;
    culturalTips?: string[] | undefined;
    assumptions?: string[] | undefined;
}>;
export type PlannerInput = z.infer<typeof plannerInputSchema>;
export type Activity = z.infer<typeof activitySchema>;
export type ItineraryDraft = z.infer<typeof itineraryDraftSchema>;
//# sourceMappingURL=itinerary.d.ts.map