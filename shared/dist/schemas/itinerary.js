"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.itineraryDraftSchema = exports.activitySchema = exports.plannerInputSchema = void 0;
const zod_1 = require("zod");
exports.plannerInputSchema = zod_1.z.object({
    // Either a known destination slug OR a free-text city+country
    destinationSlug: zod_1.z.string().min(1).max(100).optional(),
    city: zod_1.z.string().min(1).max(100).optional(),
    country: zod_1.z.string().min(1).max(100).optional(),
    durationDays: zod_1.z.number().int().min(1).max(14),
    startDate: zod_1.z.coerce.date().optional(),
    interests: zod_1.z
        .array(zod_1.z.enum(['culture', 'food', 'adventure', 'relaxation', 'nightlife', 'nature', 'shopping', 'history']))
        .max(8)
        .default([]),
    pace: zod_1.z.enum(['relaxed', 'balanced', 'packed']).default('balanced'),
    budgetLevel: zod_1.z.number().int().min(1).max(5).optional(),
    budgetCurrency: zod_1.z.enum(['USD', 'INR', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']).default('USD'),
    dietaryPreferences: zod_1.z.array(zod_1.z.string().trim().max(40)).max(5).default([]),
    notes: zod_1.z.string().trim().max(300).optional(),
});
exports.activitySchema = zod_1.z.object({
    timeBlock: zod_1.z.enum(['MORNING', 'AFTERNOON', 'EVENING']),
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().max(600).default(''),
    category: zod_1.z.enum(['food', 'sight', 'culture', 'transport', 'rest', 'activity']).default('activity'),
    estimatedCost: zod_1.z.number().min(0).max(1000000).nullable().default(null),
    currencyCode: zod_1.z.string().max(5).nullable().default(null),
    caveat: zod_1.z.string().max(400).nullable().default(null),
});
exports.itineraryDraftSchema = zod_1.z.object({
    summary: zod_1.z.string().max(1000).default(''),
    days: zod_1.z
        .array(zod_1.z.object({
        dayNumber: zod_1.z.number().int().min(1),
        theme: zod_1.z.string().max(200).default(''),
        activities: zod_1.z.array(exports.activitySchema).min(1).max(10),
    }))
        .min(1)
        .max(14),
    foodSuggestions: zod_1.z.array(zod_1.z.string().max(300)).max(15).default([]),
    culturalTips: zod_1.z.array(zod_1.z.string().max(400)).max(12).default([]),
    assumptions: zod_1.z.array(zod_1.z.string().max(400)).max(10).default([]),
});
//# sourceMappingURL=itinerary.js.map