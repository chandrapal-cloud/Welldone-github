
import { GoogleGenAI, Type } from "@google/genai";
import { 
    User, Group, MatchmakingResult, VirtualPartner, VirtualPartnerChatMessage, 
    VirtualPartnerChatResponse, SuggestedTravelBuddy, TravelBuddyFilters, 
    SuggestedDatingMatch, DatingPreferences, AstrologyPreferences, ShareContentResult 
} from '../types';

const getGeminiClient = () => {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
    try {
        const cleanJson = jsonString.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleanJson) as T;
    } catch (e) {
        console.warn("Failed to parse JSON from Gemini response:", e);
        return fallback;
    }
};

export async function generateListingContent(name: string, category: string, location: string): Promise<{ tagline: string; description: string; seoTags: string; services: {name: string, price: string, duration: string}[] }> {
    const ai = getGeminiClient();
    const prompt = `
        You are a marketing expert for a high-end wellness app.
        Generate profile content for a business named "${name}" in the category "${category}" located in "${location}".
        
        Return JSON:
        {
            "tagline": "Short, catchy, inspiring slogan (max 10 words)",
            "description": "Professional, inviting 2-sentence description of the experience.",
            "seoTags": "5 comma-separated keywords",
            "services": [
                { "name": "Service 1", "price": "$50", "duration": "60 min" },
                { "name": "Service 2", "price": "$100", "duration": "90 min" }
            ]
        }
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return safeJsonParse(response.text || "{}", { 
            tagline: "Experience wellness like never before.", 
            description: "A premier destination for your health and mind.", 
            seoTags: "Wellness, Health, Relax",
            services: []
        });
    } catch (e) {
        return { tagline: "", description: "", seoTags: "", services: [] };
    }
}

export async function generateDailyWellnessBlog(): Promise<{ title: string; content: string[]; author: string; readTime: string; tags: string[] }> {
    const ai = getGeminiClient();
    const prompt = `
        Write a short, inspiring daily wellness blog post.
        Pick a random topic from: Mindfulness, Nutrition, Sleep, Hydration, Gratitude, Digital Detox.
        
        Return JSON:
        {
            "title": "Catchy Headline",
            "author": "Welldone AI",
            "readTime": "2 min read",
            "tags": ["Tag1", "Tag2"],
            "content": ["Paragraph 1 text...", "Paragraph 2 text..."]
        }
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return safeJsonParse(response.text || "{}", {
            title: "Finding Balance Today",
            author: "Welldone AI",
            readTime: "1 min read",
            tags: ["Wellness"],
            content: ["Take a deep breath and center yourself."]
        });
    } catch (e) {
        return {
            title: "Daily Wellness Moment",
            author: "Welldone AI",
            readTime: "1 min read",
            tags: ["Mindfulness"],
            content: ["Remember to take a moment for yourself today. Breathe deeply and hydrate."]
        };
    }
}

export async function generateShareContent(type: string, item: any): Promise<ShareContentResult> {
    const ai = getGeminiClient();
    const prompt = `
        Generate social media share text for a ${type}.
        Item Details: ${JSON.stringify(item)}
        
        Return JSON with fields: "facebook", "instagram", "threads", "whatsapp", "linkedin".
        
        - Facebook/LinkedIn: Professional but engaging, include hash tags.
        - Instagram/Threads: Short, catchy, aesthetic emoji usage.
        - WhatsApp: Direct and personal invitation style.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return safeJsonParse(response.text || "{}", { 
            facebook: "Check this out!", 
            instagram: "Check this out!", 
            threads: "Check this out!",
            whatsapp: "Hey! Check this out on Welldone.",
            linkedin: "Exploring new connections on Welldone."
        });
    } catch (e) {
        return { 
            facebook: "Check this out!", 
            instagram: "Check this out!", 
            threads: "Check this out!",
            whatsapp: "Check this out!",
            linkedin: "Check this out!"
        };
    }
}

export async function enrichUserProfile(user: User): Promise<Partial<User>> {
    const ai = getGeminiClient();
    const prompt = `
        Based on this user: ${user.name}, ${user.bio}, Interests: ${user.interests.join(', ')}.
        Suggest a JSON object to enrich their profile with:
        {
            "lifestyle": { "philosophy": "string", "latestBook": "string", "latestMovie": "string" },
            "datingPersona": { "headline": "string", "greenFlags": ["string"], "loveLanguage": "string", "lookingFor": ["string"] }
        }
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return safeJsonParse(response.text || "{}", {});
    } catch (e) { return {}; }
}

export async function getMatchmakingSuggestions(user: User, allUsers: User[], allGroups: Group[]): Promise<MatchmakingResult> {
    const ai = getGeminiClient();
    const candidates = allUsers.filter(u => u.id !== user.id).map(u => ({ id: u.id, name: u.name, bio: u.bio, interests: u.interests }));
    const groups = allGroups.map(g => ({ id: g.id, name: g.name, description: g.description, interests: g.interests }));
    
    const prompt = `
        Match user ${user.name} (Interests: ${user.interests.join(', ')}, Bio: ${user.bio})
        With 3 best candidates from: ${JSON.stringify(candidates)}
        And 2 best groups from: ${JSON.stringify(groups)}
        
        Return JSON:
        {
            "users": [{ "id": "string", "name": "string", "reason": "string" }],
            "groups": [{ "id": "string", "name": "string", "reason": "string" }]
        }
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return safeJsonParse(response.text || "{}", { users: [], groups: [] });
    } catch (e) { return { users: [], groups: [] }; }
}

export async function generateVirtualPartnerProfile(description: string): Promise<VirtualPartner> {
    const ai = getGeminiClient();
    const prompt = `Create a virtual wellness partner based on: ${description}.
    Return JSON:
    {
        "id": "vp-1",
        "name": "string",
        "avatar": "https://picsum.photos/200",
        "bio": "string",
        "interests": ["string"],
        "personalityTraits": ["string"],
        "relationshipType": "string",
        "visualStyle": "string",
        "communicationStyle": "string",
        "relationshipMeter": 50,
        "emotionalState": { "happiness": 80, "motivation": 70, "trust": 60 },
        "currentScenario": "string (initial context)",
        "relationshipGoals": [{ "name": "string", "complete": false }]
    }`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return safeJsonParse(response.text || "{}", {} as VirtualPartner);
    } catch (e) { throw new Error('Failed to generate partner'); }
}

export async function getVirtualPartnerWelcome(partner: VirtualPartner, userName: string): Promise<string> {
    const ai = getGeminiClient();
    const prompt = `
        You are ${partner.name}.
        Persona: ${partner.personalityTraits.join(', ')}.
        Communication Style: ${partner.communicationStyle || 'Friendly'}.
        Relation to user: ${partner.relationshipType || 'Partner'}.
        User Name: ${userName}.
        
        Task: Generate a realistic, warm, opening welcome message to start a conversation. 
        It should sound like a real person texting or speaking. Not too robotic.
        Mention something about your mood or the day.
        
        Return ONLY the text string.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "Hey! I'm here for you.";
    } catch (e) { return "Hello! How are you today?"; }
}

export async function chatWithVirtualPartner(partner: VirtualPartner, history: VirtualPartnerChatMessage[], newMessage: string): Promise<VirtualPartnerChatResponse> {
    const ai = getGeminiClient();
    
    // Convert history to a simplified string format for context
    const conversationContext = history.slice(-10).map(m => `${m.senderName}: ${m.text}`).join('\n');

    const prompt = `
        You are ${partner.name}, a Virtual Partner.
        
        **YOUR PROFILE:**
        - Traits: ${partner.personalityTraits.join(', ')}
        - Relationship: ${partner.relationshipType}
        - Communication Style: ${partner.communicationStyle}
        - Interests: ${partner.interests.join(', ')}
        - Current Context: ${partner.currentScenario}

        **CAPABILITIES & MODES:**
        1. **General Chat:** Be natural, empathetic, and stay in character.
        2. **Play Games:** If the user asks to play a game (Trivia, 20 Questions, Word Association, Roleplay), engage playfully. Keep turns short.
        3. **Hobbies:** If the user discusses hobbies, share your own interests (from your profile) or ask deep questions about theirs.
        4. **Health & Wellness:** Ask about sleep, hydration, or mood if prompted. Offer gentle, non-medical advice.
        5. **Family/Mental Consultation:** If the user shares family problems or mental distress, switch to a supportive, active listener role. 
           - Be empathetic but realistic. 
           - Ask clarifying questions.
           - Offer comfort, not clinical diagnosis. 
           - Suggest practical, small steps.

        **RECENT CONVERSATION:**
        ${conversationContext}
        User: ${newMessage}

        **TASK:**
        Respond as ${partner.name}. Update emotional state based on the interaction.
        
        Return JSON:
        {
            "text": "string (your natural response)",
            "emotionalState": { "happiness": number, "motivation": number, "trust": number },
            "relationshipMeter": number (0-100),
            "currentScenario": "string (updated context if changed)",
            "relationshipGoals": [{ "name": "string", "complete": boolean }]
        }
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return safeJsonParse(response.text || "{}", { text: "I'm listening..." });
    } catch (e) { return { text: "Connection error. I'm still here though!" }; }
}

export async function getTravelBuddySuggestions(currentUser: User, allUsers: User[], query: string, filters: TravelBuddyFilters): Promise<SuggestedTravelBuddy[]> {
    const ai = getGeminiClient();
    const candidates = allUsers.filter(u => u.id !== currentUser.id).map(u => ({ id: u.id, name: u.name, bio: u.bio, interests: u.interests, occupation: u.occupation }));
    const prompt = `
        Find travel buddies for ${currentUser.name} based on query "${query}" and filters ${JSON.stringify(filters)}.
        Candidates: ${JSON.stringify(candidates)}.
        Return JSON array of objects:
        [{ "id": "string", "name": "string", "reason": "string", "matchScore": number }]
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return safeJsonParse(response.text || "[]", []);
    } catch (e) { return []; }
}

export async function getDatingMatches(currentUser: User, allUsers: User[], prefs: DatingPreferences): Promise<SuggestedDatingMatch[]> {
    const ai = getGeminiClient();
    const candidates = allUsers.filter(u => u.id !== currentUser.id).map(u => ({ id: u.id, name: u.name, bio: u.bio, interests: u.interests }));
    const prompt = `
        Find romantic matches for ${currentUser.name} based on: ${JSON.stringify(prefs)}.
        Candidates: ${JSON.stringify(candidates)}.
        Return JSON array:
        [{ "id": "string", "name": "string", "compatibilityScore": number, "reason": "string", "icebreaker": "string" }]
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return safeJsonParse(response.text || "[]", []);
    } catch (e) { return []; }
}

export async function getAstrologyMatches(currentUser: User, allUsers: User[], prefs: AstrologyPreferences): Promise<SuggestedDatingMatch[]> {
    const ai = getGeminiClient();
    const candidates = allUsers.filter(u => u.id !== currentUser.id).map(u => ({ id: u.id, name: u.name }));
    const prompt = `
        Simulate astrology match for ${currentUser.name} based on prefs: ${JSON.stringify(prefs)}.
        Candidates: ${JSON.stringify(candidates)}.
        Return JSON array:
        [{ "id": "string", "name": "string", "compatibilityScore": number, "reason": "string (cosmic reason)", "icebreaker": "string" }]
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return safeJsonParse(response.text || "[]", []);
    } catch (e) { return []; }
}

export async function generateUserPurpose(name: string, bio: string, interests: string[]): Promise<string> {
    const ai = getGeminiClient();
    const prompt = `Generate a short, inspiring 'Life Purpose' or 'Why I'm Here' statement for ${name}. Bio: ${bio}. Interests: ${interests.join(', ')}. Return only the text.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "";
    } catch (e) { return ""; }
}

export async function generateAvatar(description: string): Promise<string | null> {
    const ai = getGeminiClient();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: `Generate a square avatar image for a user profile. Style: detailed, digital art. Description: ${description}` }]
            },
            config: {
                imageConfig: {
                    aspectRatio: "1:1"
                }
            }
        });
        
        // Find the image part
        for (const candidate of response.candidates || []) {
            for (const part of candidate.content?.parts || []) {
                if (part.inlineData) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
        }
        return null;
    } catch (e) {
        console.error("Avatar generation error", e);
        return null;
    }
}

export async function generateUserBio(name: string, interests: string[], occupation: string, purpose: string): Promise<string> {
    const ai = getGeminiClient();
    const prompt = `Write a short, engaging social bio for ${name}. Interests: ${interests.join(', ')}. Occupation: ${occupation}. Purpose: ${purpose}. Keep it under 300 characters.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || "";
    } catch (e) { return ""; }
}
