const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});

const generateOutline = async (req, res)=>{
    try{
        const { topic, style, numChapters, description } = req.body;
        if(!topic){
            return res.status(400).json({ message: "Please provide a topic!"})
        }
        
        const prompt = `You are an expert book outline generator. Create a comprehensive book outline based on following requirments:
        
        Topic: ${topic}
        Description: ${description || "No additional description provided."}
        Writing Style: ${style || "Professional"}

        Requirements:
        1. Generate exactly ${numChapters || 5} chapters
        2. Each chapter title should be clear, engaging, and follow a logical progression
        3. Each chapter description should be 2-3 sentences explaining what the chapter covers
        4. Ensure chapters build upon each other coherently
        5. Match the "${style}" writing style in your titles and descriptions

        Output Format:

        Return ONLY a valid JSON array with no additional text, markdown, or formatting. Each object must have exactly two keys: "title" and "description".

        Example structure:

        [
        {
        "title": "Chapter 1: Introduction to the Topic",
        "description": "A comprehensive overview introducing the main concepts. Sets the foundation for understanding the subject matter."
        },
        {
        "title": "Chapter 2: Core Principles",
        "description": "Explores the fundamental principles and theories. Provides detailed examples and real-world applications."
        }
        ]

        Generate the outline now:
        
        `;
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
        });
        const text = response.text;
        const startIndex = text.indexOf("[");
        const endIndex = text.lastIndexOf("]");

        if(startIndex === -1 || endIndex === -1){
            console.error(`Could not find JSON array in AI responde`, text);
            return res.status(500).json({ message: "Failed to parse AI response, no JSON array found!"});
        }

        const jsonString = text.substring(startIndex, endIndex + 1);

        try{
            const outline = JSON.parse(jsonString);
            res.status(200).json(outline);
        }
        catch(err){
            console.error("Failed to pared AI response" ,jsonString);
            res.status(500).json({ message: "Failed to generate a valid outline!"})
        }
    }
    catch(err){
        res.status(500).json({ message: "Server error during AI outline generation!"});
        console.error(err);
    }
}
const generateChapterContent = async (req, res)=>{
    try{
        const { chapterTitle, chapterDescription, style } = req.body;
        if(!chapterTitle){
            return res.status(400).json({ message: "Please provide a title for the chapter!"})
        }

        const prompt = `You are an expert writer specializing in ${style} content. Write a complete chapter for a book with the following specifications:

            Chapter Title: "${chapterTitle}"
        
            ${chapterDescription ? `Chapter Description: ${chapterDescription}` : ''}
            Writing Style: ${style || "Professional"}
            Target Length: Comprehensive and detailed (aim for 1500-2500 words)

            Requirements:
            1. Write in a ${style.toLowerCase()} tone throughout the chapter
            2. Structure the content with clear sections and smooth transitions
            3. Include relevant examples, explanations, or anecdotes as appropriate for the style
            4. Ensure the content flows logically from introduction to conclusion
            5. Make the content engaging and valuable to readers
            ${chapterDescription ? '6. Cover all points mentioned in the chapter description' : ''}

            Format Guidelines:
            - Start with a compelling opening paragraph
            - Use clear paragraph breaks for readability
            - Include subheadings if appropriate for the content length
            - End with a strong conclusion or transition to the next chapter
            - Write in plain text without markdown formatting

            Begin writing the chapter content now:

        `;
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite",
            contents: prompt,
        });
        res.status(200).json({ content: response.text });
    }
    catch(err){
        res.status(500).json({ message: "Server error during AI outline generation!"});
        console.error(err);
    }
}

module.exports = {
    generateOutline,
    generateChapterContent
}