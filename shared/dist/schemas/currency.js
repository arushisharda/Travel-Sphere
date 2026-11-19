"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertQuerySchema = exports.SUPPORTED_CURRENCIES = void 0;
const zod_1 = require("zod");
exports.SUPPORTED_CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
exports.convertQuerySchema = zod_1.z.object({
    amount: zod_1.z.coerce.number().finite().positive().max(1_000_000_000),
    from: zod_1.z.enum(exports.SUPPORTED_CURRENCIES),
    to: zod_1.z.enum(exports.SUPPORTED_CURRENCIES),
});
//# sourceMappingURL=currency.js.map