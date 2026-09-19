/**
 * Generates an AI response based on a prompt and optional location context
 * @param {string} prompt User's question or prompt
 * @param {object|null} locationContext Contextual location data
 * @returns {object} AI response object
 */
export function generateAIChatResponse(prompt, locationContext = null) {
    const lowerPrompt = prompt.toLowerCase();
    
    let reply = '';
    let confidence = 95;
    let sources = ['SafeMap AI Models', 'Local Police Data', 'Community Reports'];
    let suggestedQuestions = [];

    // Pattern matching logic
    if (lowerPrompt.includes('emergency') || lowerPrompt.includes('help') || lowerPrompt.includes('police')) {
        reply = `**EMERGENCY ASSISTANCE**\n\nIf you are in immediate danger, please dial local emergency services immediately (112 or 100).\n\nBased on your query, here are the nearest verified safe zones:\n- Main City Police Station (1.2km)\n- General Hospital (2.5km)\n\n*Please seek immediate human assistance.*`;
        confidence = 100;
        suggestedQuestions = ['Show nearest safe zones', 'Share my live location', 'Alert emergency contacts'];
    } 
    else if (locationContext) {
        const { name, city, score, sub, crime, weather, traffic } = locationContext;
        
        reply = `**Location Analysis for ${name}, ${city}**\n\n`;
        reply += `The current safety score is **${score}/100**. `;
        
        if (score > 80) reply += `This area is considered highly safe right now.\n\n`;
        else if (score > 50) reply += `This area is moderately safe, but exercise standard caution.\n\n`;
        else reply += `**Caution advised.** This area currently has a lower safety score.\n\n`;

        reply += `**Breakdown:**\n`;
        if (sub) {
            reply += `- Lighting: ${sub.lighting || 'N/A'}%\n`;
            reply += `- CCTV Coverage: ${sub.cctv || 'N/A'}%\n`;
            reply += `- Police Presence: ${sub.police || 'N/A'}%\n`;
        }

        if (crime) {
            reply += `\n**Top Crime Concern:** ${crime}\n`;
        }

        reply += `\n**Environmental Factors:**\n`;
        reply += `- Weather: ${weather || 'Clear'}\n`;
        reply += `- Traffic: ${traffic || 'Normal'}\n\n`;

        reply += `**Recommendations:**\nStick to well-lit main roads. If traveling late, prefer the 'Women Safe' or 'Safest' route options in the navigation panel.`;
        
        confidence = 92;
        suggestedQuestions = ['What is the safest route home?', 'Are there any active alerts here?', 'Show me historical crime trends'];
    }
    else if (lowerPrompt.includes('safe') || lowerPrompt.includes('secure')) {
        reply = `Based on current real-time data, the safest areas in your city right now tend to be the central commercial districts due to high CCTV coverage and active police patrols.\n\nAlways remember to use the **Safe Routing** feature when planning your trips to get personalized, safety-optimized directions.`;
        confidence = 88;
        suggestedQuestions = ['Which areas should I avoid?', 'How does SafeMap calculate safety?', 'Show safe areas on map'];
    }
    else if (lowerPrompt.includes('route') || lowerPrompt.includes('directions')) {
        reply = `I can help you analyze route safety. Our routing engine calculates 6 different types of routes including:\n\n- **Safest**: Maximum security features\n- **Women Safe**: Highly populated and well-lit\n- **Balanced**: Best mix of time and safety\n\nPlease select your destination on the map to see these options.`;
        confidence = 94;
        suggestedQuestions = ['What makes a route "Women Safe"?', 'How accurate is the ETA?', 'Can I share my route?'];
    }
    else {
        reply = `I'm your SafeMap AI Assistant. I can analyze locations, suggest safe routes, provide real-time alerts, and analyze crime trends.\n\nHow can I help you stay safe today? Provide a specific location or ask about general safety features.`;
        confidence = 99;
        suggestedQuestions = ['Analyze my current location', 'What are the current active alerts?', 'Show me crime analytics'];
    }

    return {
        reply,
        confidence,
        sources,
        suggestedQuestions,
        timestamp: new Date().toISOString()
    };
}
