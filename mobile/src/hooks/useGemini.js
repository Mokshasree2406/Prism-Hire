import { useState, useCallback, useEffect } from 'react';
import api from '../lib/api';

const useGemini = (config = null) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sessionId, setSessionId] = useState(null);

    // Initialize session when config provided
    useEffect(() => {
        if (!config) return;

        const initSession = async () => {
            try {
                // api.post automatically handles base URL and auth tokens
                const res = await api.post('/interviewer/start-chat', { config });
                if (res.data.sessionId) {
                    setSessionId(res.data.sessionId);
                } else {
                    console.error("No Session ID returned");
                }
            } catch (err) {
                console.error("Failed to start session:", err);
                setError("Failed to connect to AI server.");
            }
        };

        initSession();
    }, [config]);

    const generateResponse = useCallback(async (message) => {
        if (!sessionId) {
            return "Error: AI Session not established.";
        }

        setLoading(true);
        setError(null);

        try {
            const res = await api.post('/interviewer/chat', { sessionId, message });
            setLoading(false);
            return res.data.text;
        } catch (err) {
            console.error("Chat Error:", err);
            setError("Connection Error");
            setLoading(false);
            return "Error: Connection failed.";
        }
    }, [sessionId]);

    const generateFeedback = useCallback(async () => {
        if (!sessionId) return null;

        setLoading(true);
        try {
            const res = await api.post('/interviewer/feedback', { sessionId });
            setLoading(false);
            return res.data;
        } catch (err) {
            console.error("Feedback error:", err);
            setLoading(false);
            return {
                score: 0,
                summary: "Connection error during feedback.",
                strengths: [],
                weaknesses: [],
                resources: []
            };
        }
    }, [sessionId]);

    return { generateResponse, generateFeedback, loading, error };
};

export default useGemini;
