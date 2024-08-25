import express from "express";
import { draftContract } from "./contract_drafting";
const app = express();
app.use(express.json());

app.post("/draftContract", async (req, res) => {
    const { employerTerms } = req.body;

    if (!employerTerms) {
        return res.status(400).json({ error: "Employer terms are required" });
    }

    try {
        const contract = await draftContract(employerTerms);
        res.json({ contract });
    } catch (error) {
        res.status(500).json({ error: "Failed to draft contract" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});