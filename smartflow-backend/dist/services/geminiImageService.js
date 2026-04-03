import { GoogleGenAI } from "@google/genai";
const apiKey = process.env.GEMINI_API;
const ai = new GoogleGenAI({ apiKey });
const isValidBase64 = (str) => {
    return typeof str === "string";
};
export const getTraffic = async (base64ImageFileA, base64ImageFileB, base64ImageFileC, base64ImageFileD) => {
    try {
        if (!isValidBase64(base64ImageFileA) ||
            !isValidBase64(base64ImageFileB) ||
            !isValidBase64(base64ImageFileC) ||
            !isValidBase64(base64ImageFileD)) {
            throw new Error("Invalid image input");
        }
        const contents = [
            {
                inlineData: {
                    mimeType: "image/png",
                    data: base64ImageFileA,
                }
            }, {
                inlineData: {
                    mimeType: "image/png",
                    data: base64ImageFileB,
                }
            }, {
                inlineData: {
                    mimeType: "image/png",
                    data: base64ImageFileC,
                }
            }, {
                inlineData: {
                    mimeType: "image/png",
                    data: base64ImageFileD,
                },
            },
            {
                text: `
You are given 4 traffic images.

Image mapping:
1 → A
2 → B
3 → C
4 → D

Task:
Count the number of vehicles in each image.

Return ONLY valid JSON in this exact format:
{
  "A": number,
  "B": number,
  "C": number,
  "D": number
}

Rules:
- numbers must be integers (0 or more)
- do not include any explanation
- do not include markdown or code blocks
- do not change the JSON structure`
            },
        ];
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
        });
        let text = response.text;
        text = text.replace(/```json|```/g, "").trim();
        const parsedJSON = JSON.parse(text);
        // if (!isValidTraffic(parsedJSON)) {
        //   throw new Error("Invalid AI response format");
        // }
        console.log(parsedJSON);
        return parsedJSON;
    }
    catch (e) {
        throw e;
    }
};
//# sourceMappingURL=geminiImageService.js.map