import { GoogleGenAI, Type } from "@google/genai";
import { RealLocationData, UserGuesses, ValidationResult } from '../types';

if (!process.env.API_KEY) {
    // In a real app, you would want to handle this more gracefully.
    // For this example, we will throw an error if the API key is not set.
    // The key is expected to be set in the environment variables.
    console.warn(
      "API_KEY is not set. Please set the API_KEY environment variable."
    );
  }

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// This new schema combines all the data needed in a single API response.
const sessionProcessingSchema = {
    type: Type.OBJECT,
    properties: {
        locationData: {
            type: Type.OBJECT,
            properties: {
                country: { type: Type.STRING, description: "The country where the coordinates are located." },
                continent: { type: Type.STRING, description: "The continent of the location." },
                areaType: { type: Type.STRING, description: "The primary type of area (e.g., Urban, Forest, Desert, Water)." },
                majorFeatures: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "A list of 3-5 major natural or man-made features at this location."
                },
                dominantLanguages: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "A list of dominant languages spoken in this area."
                },
            },
            required: ["country", "continent", "areaType", "majorFeatures", "dominantLanguages"]
        },
        validationResult: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.NUMBER, description: "An overall score from 0 to 100 based on the accuracy of all guesses." },
                feedback: {
                    type: Type.OBJECT,
                    properties: {
                         seenObject1: { type: Type.OBJECT, properties: { guess: { type: Type.STRING }, actual: { type: Type.STRING }, evaluation: { type: Type.STRING, enum: ['correct', 'close', 'wrong'] }, explanation: { type: Type.STRING } }, required: ["guess", "actual", "evaluation", "explanation"] },
                         seenObject2: { type: Type.OBJECT, properties: { guess: { type: Type.STRING }, actual: { type: Type.STRING }, evaluation: { type: Type.STRING, enum: ['correct', 'close', 'wrong'] }, explanation: { type: Type.STRING } }, required: ["guess", "actual", "evaluation", "explanation"] },
                         seenObject3: { type: Type.OBJECT, properties: { guess: { type: Type.STRING }, actual: { type: Type.STRING }, evaluation: { type: Type.STRING, enum: ['correct', 'close', 'wrong'] }, explanation: { type: Type.STRING } }, required: ["guess", "actual", "evaluation", "explanation"] },
                         continent: { type: Type.OBJECT, properties: { guess: { type: Type.STRING }, actual: { type: Type.STRING }, evaluation: { type: Type.STRING, enum: ['correct', 'close', 'wrong'] }, explanation: { type: Type.STRING } }, required: ["guess", "actual", "evaluation", "explanation"] },
                         language: { type: Type.OBJECT, properties: { guess: { type: Type.STRING }, actual: { type: Type.STRING }, evaluation: { type: Type.STRING, enum: ['correct', 'close', 'wrong'] }, explanation: { type: Type.STRING } }, required: ["guess", "actual", "evaluation", "explanation"] },
                         areaType: { type: Type.OBJECT, properties: { guess: { type: Type.STRING }, actual: { type: Type.STRING }, evaluation: { type: Type.STRING, enum: ['correct', 'close', 'wrong'] }, explanation: { type: Type.STRING } }, required: ["guess", "actual", "evaluation", "explanation"] }
                    },
                     required: ["seenObject1", "seenObject2", "seenObject3", "continent", "language", "areaType"]
                }
            },
            required: ["score", "feedback"]
        },
        photoKeywords: {
            type: Type.STRING,
            description: "A comma-separated list of 3-4 concise, effective keywords for finding a representative stock photo (e.g., 'Eiffel Tower,Paris,cityscape')."
        }
    },
    required: ["locationData", "validationResult", "photoKeywords"]
};

interface ProcessedSesssionData {
    realData: RealLocationData;
    validation: ValidationResult;
    photoUrl: string;
    attribution: string;
}

/**
 * A single, optimized function to get all session data in one API call.
 */
export const processRemoteViewingSession = async (
    coordinates: { lat: number, lng: number },
    userGuesses: UserGuesses
): Promise<ProcessedSesssionData> => {

    const prompt = `
        You are a remote viewing validation assistant. Your task is to process a set of coordinates and a user's psychic impressions in three steps, returning a single JSON object.
        
        1.  **Determine Ground Truth:** For the coordinates latitude ${coordinates.lat}, longitude ${coordinates.lng}, identify the real-world geographical and cultural information. Do not invent data.
        
        2.  **Validate Guesses:** Using the ground truth from step 1, analyze the user's guesses below. Provide a score (0-100) and detailed feedback for each guess. Be lenient with synonyms (e.g., 'sea'/'ocean', 'jungle'/'forest'). 'close' is for conceptually related items (e.g., 'hills' for 'mountains'). 'correct' is for direct matches or synonyms.
        
        3.  **Generate Keywords:** Based on the ground truth, generate a comma-separated list of 3-4 concise keywords for finding a representative stock photo.
        
        **User's Guesses:** ${JSON.stringify(userGuesses)}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: sessionProcessingSchema,
            },
        });
        
        const jsonStr = response.text.trim();
        const parsedResponse = JSON.parse(jsonStr);

        const realData = parsedResponse.locationData as RealLocationData;
        const validation = parsedResponse.validationResult as ValidationResult;
        
        const keywords = parsedResponse.photoKeywords.replace(/\s+/g, '').toLowerCase();
        const photoUrl = `https://source.unsplash.com/800x400/?${keywords || 'travel'}`;

        return {
            realData,
            validation,
            photoUrl,
            attribution: 'Photo from Unsplash'
        };

    } catch (error) {
        console.error("Error processing session with Gemini:", error);
        throw new Error("Failed to process remote viewing session.");
    }
};