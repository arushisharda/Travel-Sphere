"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.travelPreferenceSchema = void 0;
const zod_1 = require("zod");
exports.travelPreferenceSchema = zod_1.z.object({
    climate: zod_1.z.enum(['temperate', 'tropical', 'arid', 'alpine', 'mediterranean']).optional(),
    budgetLevel: zod_1.z.number().int().min(1).max(5).optional(),
    pace: zod_1.z.enum(['relaxed', 'balanced', 'packed']).optional(),
    interests: zod_1.z.array(zod_1.z.string().trim().max(40)).max(10).default([]),
    foodPrefs: zod_1.z.string().trim().max(200).optional(),
});
//# sourceMappingURL=preferences.js.map