import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../lib/api';
import { AuthContext } from './AuthContext';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [sessions, setSessions] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        if (user) {
            fetchSessions();
        } else {
            setSessions([]);
            setActiveSession(null);
        }
    }, [user, refreshTrigger]);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/sessions');
            setSessions(res.data);
            // If we have sessions but no active session, valid check if one is marked active from DB
            const active = res.data.find(s => s.status === 'active') || res.data[0];
            // Note: Check backend if 'isActive' or 'status' is used. Web code used `s.isActive`.
            // Let's assume web code `res.data.find(s => s.isActive)` is correct.
            // But if backend doesn't return isActive, we might need to manage it locally or rely on ID.

            // Re-checking web code: `const active = res.data.find(s => s.isActive);`
            const activeFromDb = res.data.find(s => s.isActive);
            if (activeFromDb) {
                setActiveSession(activeFromDb);
            } else if (res.data.length > 0) {
                // Fallback to first if none active? Or let user select? 
                // Better to have one active.
                setActiveSession(res.data[0]);
            }
        } catch (err) {
            console.error("Failed to fetch sessions:", err);
        } finally {
            setLoading(false);
        }
    };

    const createSession = async (sessionData) => {
        setLoading(true);
        try {
            const res = await api.post('/sessions', sessionData);
            setSessions(prev => [res.data, ...prev]);
            setActiveSession(res.data);
            return res.data;
        } catch (err) {
            console.error("Failed to create session:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const switchSession = (session) => {
        setActiveSession(session);
        // Optionally notify backend to set this as active if needed for persistence across devices
        // api.patch(`/sessions/${session._id}/active`);
    };

    const deleteSession = async (sessionId) => {
        setLoading(true);
        try {
            await api.delete(`/sessions/${sessionId}`);
            // Remove from local state
            setSessions(prev => prev.filter(s => s._id !== sessionId));
            // If deleted session was active, switch to first remaining session
            if (activeSession?._id === sessionId) {
                const remaining = sessions.filter(s => s._id !== sessionId);
                setActiveSession(remaining.length > 0 ? remaining[0] : null);
            }
        } catch (err) {
            console.error("Failed to delete session:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const refreshSessions = () => setRefreshTrigger(prev => prev + 1);

    return (
        <SessionContext.Provider value={{
            sessions,
            activeSession,
            loading,
            createSession,
            switchSession,
            deleteSession,
            refreshSessions
        }}>
            {children}
        </SessionContext.Provider>
    );
};
