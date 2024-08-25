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
exports.draftContract = void 0;
const openai_1 = require("openai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log("OpenAI API Key:", process.env.OPENAI_API_KEY); // Should print your API key or undefined
if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OpenAI API Key in environment variables");
}
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
function draftContract(employerTerms) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that drafts a contract based on the employer's terms.",
                    },
                    {
                        role: "user",
                        content: `Draft a contract based on the following employer terms: ${employerTerms}`,
                    },
                ],
            });
            return response.choices[0].message.content;
        }
        catch (error) {
            console.error("Error drafting contract:", error);
            throw new Error("Failed to draft contract");
        }
    });
}
exports.draftContract = draftContract;
//# sourceMappingURL=contract_drafting.js.map