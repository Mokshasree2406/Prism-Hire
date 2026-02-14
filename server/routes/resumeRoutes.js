const express = require('express');
const upload = require('../config/multer');
const { parseResume } = require('../services/resumeParser');
const { calculateATSScore } = require('../services/atsScorer');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const fs = require('fs').promises;

const router = express.Router();

// Analyze resume endpoint
// Note: Using a fixed demo user ID if req.user is not populated, or rely on auth middleware
router.post('/analyze', upload.single('resume'), async (req, res) => {
    let filePath = null;

    try {
        // Fallback if no user is attached (though Test_Version has auth, we might want to support guest or handle it)
        const userId = req.user ? req.user._id : '000000000000000000000000';

        const { role, jobDescription } = req.body;

        // Validation
        if (!req.file) {
            return res.status(400).json({ error: 'Resume file is required' });
        }

        if (!role || !jobDescription) {
            return res.status(400).json({ error: 'Role and job description are required' });
        }

        filePath = req.file.path;

        // Step 1: Parse resume to extract text
        const { cleanedText, rawText } = await parseResume(filePath);

        if (!cleanedText || cleanedText.length < 50) {
            return res.status(400).json({
                error: 'Could not extract enough text from resume. Please ensure the file is readable.'
            });
        }

        const { GoogleGenerativeAI } = require('@google/generative-ai');

        // Step 2: Calculate ATS score
        const scoreResult = calculateATSScore(cleanedText, jobDescription, role);

        // Step 2.1: Generate AI Summary & Improvements using Gemini
        let aiSummary = "Detailed analysis unavailable.";
        let aiSuggestions = [];

        try {
            if (process.env.MY_GEMINI_KEY) {
                const genAI = new GoogleGenerativeAI(process.env.MY_GEMINI_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

                const prompt = `
                You are an expert Resume Analyst and ATS Specialist.
                
                Analyze the following resume text against the target job description for a "${role}" role.
                
                Resume Text (Excerpt):
                ${cleanedText.substring(0, 3000)}...
                
                Job Description:
                ${jobDescription.substring(0, 1000)}...
                
                Provide a JSON response with two fields:
                1. "summary": A helpful, professional summary analysis (max 3-4 sentences) focusing on fit, strengths, and one major area for improvement.
                2. "improvements": A list of 3-5 specific, actionable suggestions to improve the ATS score and relevance for this specific role.
                
                Return ONLY valid JSON.
                {
                    "summary": "...",
                    "improvements": ["...", "..."]
                }
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();

                // Parse JSON from text
                const cleanedJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
                const jsonResponse = JSON.parse(cleanedJson);

                aiSummary = jsonResponse.summary || aiSummary;
                aiSuggestions = jsonResponse.improvements || [];

            }
        } catch (aiError) {
            console.error("AI Analysis Error:", aiError);
            aiSummary = "AI analysis could not be generated at this time.";
        }

        // Combine algorithmic suggestions with AI suggestions
        const finalSuggestions = [...new Set([...scoreResult.suggestions, ...aiSuggestions])];

        // Step 3: Save analysis to database
        const analysis = new ResumeAnalysis({
            userId: userId,
            role,
            jobDescription,
            resumeText: rawText.substring(0, 5000), // Store first 5000 chars
            resumeFileName: req.file.originalname,
            atsScore: scoreResult.atsScore,
            skillMatchScore: scoreResult.skillMatchScore,
            keywordMatchScore: scoreResult.keywordMatchScore,
            roleRelevanceScore: scoreResult.roleRelevanceScore,
            matchedSkills: scoreResult.matchedSkills,
            missingSkills: scoreResult.missingSkills,
            matchedKeywordsPercent: scoreResult.matchedKeywordsPercent,
            suggestions: finalSuggestions,
            summary: aiSummary // Add summary to DB model
        });

        await analysis.save();

        // Step 4: Delete uploaded file
        try {
            await fs.unlink(filePath);
        } catch (unlinkError) {
            console.error('Error deleting file:', unlinkError);
        }

        // Step 5: Return results
        res.json({
            success: true,
            analysisId: analysis._id,
            atsScore: scoreResult.atsScore,
            skillMatchScore: scoreResult.skillMatchScore,
            keywordMatchScore: scoreResult.keywordMatchScore,
            roleRelevanceScore: scoreResult.roleRelevanceScore,
            matchedSkills: scoreResult.matchedSkills,
            missingSkills: scoreResult.missingSkills,
            matchedKeywordsPercent: scoreResult.matchedKeywordsPercent,
            suggestions: finalSuggestions,
            role,
            resumeFileName: req.file.originalname,
            summary: aiSummary
        });

    } catch (error) {
        console.error('Analysis error:', error);

        // Clean up file on error
        if (filePath) {
            try {
                await fs.unlink(filePath);
            } catch (unlinkError) {
                console.error('Error deleting file after error:', unlinkError);
            }
        }

        res.status(500).json({
            error: error.message || 'Error analyzing resume. Please try again.'
        });
    }
});

module.exports = router;
