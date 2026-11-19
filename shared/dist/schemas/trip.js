"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripUpdateSchema = exports.tripCreateSchema = void 0;
const zod_1 = require("zod");
exports.tripCreateSchema = zod_1.z.object({
    destinationSlug: zod_1.z.string().min(1).max(100),
    title: zod_1.z.string().trim().min(1).max(100),
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
    durationDays: zod_1.z.number().int().min(1).max(60),
    preferences: zod_1.z.record(zod_1.z.unknown()).optional(),
});
exports.tripUpdateSchema = zod_1.z.object({
    title: zod_1.z.string().trim().min(1).max(100).optional(),
    startDate: zod_1.z.coerce.date().optional(),
    endDate: zod_1.z.coerce.date().optional(),
    status: zod_1.z.enum(['DRAFT', 'PLANNED', 'COMPLETED']).optional(),
});
//# sourceMappingURL=trip.js.map