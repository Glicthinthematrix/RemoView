// FIX: Removed circular import of 'AppState' which was causing a declaration conflict.
export enum AppState {
    HOME = 'HOME',
    CHALLENGE = 'CHALLENGE',
    RESULTS = 'RESULTS',
    HISTORY = 'HISTORY',
}

export interface UserGuesses {
    seenObject1: string;
    seenObject2: string;
    seenObject3: string;
    continent: string;
    language: string;
    areaType: string;
}

export interface RealLocationData {
    country: string;
    continent: string;
    areaType: string;
    majorFeatures: string[];
    dominantLanguages: string[];
}

export interface ValidationFeedback {
    guess: string;
    actual: string;
    evaluation: 'correct' | 'close' | 'wrong';
    explanation: string;
}

export interface ValidationResult {
    score: number;
    feedback: {
        seenObject1: ValidationFeedback;
        seenObject2: ValidationFeedback;
        seenObject3: ValidationFeedback;
        continent: ValidationFeedback;
        language: ValidationFeedback;
        areaType: ValidationFeedback;
    };
}

export interface SessionResult {
    id: string;
    timestamp: string;
    coordinates: { lat: number; lng: number };
    userGuesses: UserGuesses;
    realData: RealLocationData;
    validation: ValidationResult;
    photoUrl: string;
    photoAttribution?: string;
}