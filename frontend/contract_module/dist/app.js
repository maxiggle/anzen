"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contract_drafting_1 = require("./contract_drafting");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/draftContract", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { employerTerms } = req.body;
    if (!employerTerms) {
        return res.status(400).json({ error: "Employer terms are required" });
    }
    try {
        const contract = yield (0, contract_drafting_1.draftContract)(employerTerms);
        res.json({ contract });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to draft contract" });
    }
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
//# sourceMappingURL=app.js.map