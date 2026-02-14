import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, FlatList } from 'react-native';
import { BrainCircuit, PlayCircle, Star, CheckCircle2, ChevronLeft, ChevronDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenWrapper from '../components/ScreenWrapper';
import api from '../lib/api';
import { SessionContext } from '../context/SessionContext';
import { UIContext } from '../context/UIContext';

export default function TestScreen({ navigation }) {
    const { activeSession, sessions } = useContext(SessionContext); // Access sessions
    const { setIsTabBarVisible } = useContext(UIContext);
    const [mode, setMode] = useState('menu'); // 'menu' | 'random' | 'saved'
    const [loading, setLoading] = useState(false);
    const [testData, setTestData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    // Saved Questions Filter
    const [filterSessionId, setFilterSessionId] = useState(null);
    const [isSavedView, setIsSavedView] = useState(false);

    // Config for Random Mode
    const [jobRole, setJobRole] = useState('Full Stack Developer');
    const [difficulty, setDifficulty] = useState('Medium');
    const [questionCount, setQuestionCount] = useState(5);

    useEffect(() => {
        if (activeSession?.jobRole) {
            setJobRole(activeSession.jobRole);
        }
    }, [activeSession]);

    // Cleanup: Ensure tab bar is visible when leaving
    useEffect(() => {
        return () => setIsTabBarVisible(true);
    }, []);

    // Toggle Tab Bar based on mode
    useEffect(() => {
        setIsTabBarVisible(mode !== 'taking');
    }, [mode]);

    const handleGenerateRandom = async () => {
        setLoading(true);
        setIsSavedView(false); // Reset saved view flag
        try {
            const res = await api.post('/generate-test', {
                jobRole,
                difficulty,
                count: questionCount
            });
            setTestData(res.data);
            setMode('taking');
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to generate test.");
        } finally {
            setLoading(false);
        }
    };

    const handleLoadSaved = async (sessionId = null) => {
        setLoading(true);
        setIsSavedView(true); // Mark as saved view
        setFilterSessionId(sessionId); // Update filter state

        try {
            const url = sessionId ? `/saved-questions?sessionId=${sessionId}` : '/saved-questions';
            const res = await api.get(url);

            if (res.data.length === 0) {
                if (sessionId) {
                    Alert.alert("No Questions", "No saved questions found for this session.");
                } else {
                    Alert.alert("No Saved Questions", "You haven't saved any questions yet.");
                }
                // If filter was applied and empty, maybe stick to current view or clear?
                // Let's just show empty list if we are already in the view, or stay in menu if first load
                if (mode === 'menu') {
                    setLoading(false);
                    return;
                }
                // If already viewing, update with empty list
                setTestData({
                    title: "Saved Questions",
                    questions: []
                });
            } else {
                setTestData({
                    title: "Saved Questions",
                    questions: res.data.map(q => ({
                        id: q._id,
                        text: q.text,
                        options: q.options,
                        correctAnswer: q.correctAnswer
                    }))
                });
                setMode('taking');
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to load saved questions.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOption = (qId, option) => {
        if (showResults) return;
        setAnswers(prev => ({ ...prev, [qId]: option }));
    };

    const calculateScore = () => {
        if (!testData) return 0;
        let correct = 0;
        testData.questions.forEach((q, idx) => {
            const qId = q.id || idx;
            if (answers[qId] === q.correctAnswer) correct++;
            else if (q.correctAnswer && q.correctAnswer.length === 1 && q.options) {
                const charCode = q.correctAnswer.toUpperCase().charCodeAt(0) - 65;
                if (q.options[charCode] === answers[qId]) correct++;
            }
        });
        return correct;
    };

    const OptionSelector = ({ label, options, selected, onSelect }) => (
        <View style={{ marginBottom: 16 }}>
            <Text style={styles.selectorLabel}>{label}</Text>
            <View style={styles.selectorRow}>
                {options.map(opt => (
                    <TouchableOpacity
                        key={opt}
                        style={[styles.selectorBtn, selected === opt && styles.selectorBtnActive]}
                        onPress={() => onSelect(opt)}
                    >
                        <Text style={[styles.selectorText, selected === opt && styles.selectorTextActive]}>{opt}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const [savedMap, setSavedMap] = useState({}); // { qId/index: dbId }
    const [toastMsg, setToastMsg] = useState(null);

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(null), 2000);
    };

    const handleToggleSave = async (item, index) => {
        const qKey = item.id || index;
        const dbId = savedMap[qKey];

        // 1. Unsave
        if (dbId) {
            try {
                // If it's a temp ID (not from DB yet) we can't delete easily unless we tracked it.
                // But for "saved questions" mode, item.id IS the dbId.
                // For "random mode", we just saved it and got a dbId.

                // If mode is 'saved', item.id is the actual DB ID.
                const idToDelete = mode === 'saved' || isSavedView ? item.id : dbId;

                await api.delete(`/saved-questions/${idToDelete}`);

                const newMap = { ...savedMap };
                delete newMap[qKey];
                setSavedMap(newMap);
                showToast("Question Unsaved");

                // If in saved view, maybe remove from list immediately?
                if (isSavedView) {
                    setTestData(prev => ({
                        ...prev,
                        questions: prev.questions.filter(q => q.id !== item.id)
                    }));
                }
            } catch (err) {
                console.error(err);
                Alert.alert("Error", "Failed to unsave.");
            }
        }
        // 2. Save
        else {
            try {
                // Construct payload matching backend expectation (array of questions)
                const payload = {
                    questions: [{
                        sessionId: activeSession?._id, // might be undefined, handled by backend?
                        // activeSession object has _id.
                        // If no session, maybe send null? Backend saved schema uses sessionId string.
                        jobRole,
                        difficulty,
                        text: item.text,
                        type: 'concept', // Defaulting for now
                        options: item.options,
                        correctAnswer: item.correctAnswer
                    }]
                };

                const res = await api.post('/save-questions', payload);
                // Backend now returns { savedQuestions: [...] }
                if (res.data.savedQuestions && res.data.savedQuestions.length > 0) {
                    const newId = res.data.savedQuestions[0]._id;
                    setSavedMap(prev => ({ ...prev, [qKey]: newId }));
                    showToast("Question Saved");
                }
            } catch (err) {
                console.error(err);
                Alert.alert("Error", "Failed to save.");
            }
        }
    };

    const renderQuestion = ({ item, index }) => {
        const qId = item.id || index;
        const isSelected = (opt) => answers[qId] === opt;

        // Check if saved
        // In "saved" mode, the question IS saved by default, but we might want to unsave it.
        // If mode === 'saved', isSaved is true unless explicit unsaved?
        // Actually, if loaded from 'saved', we should populate savedMap initially?
        // Or just check if item.id exists in savedMap?

        // Simpler approach:
        // In 'random' mode: check savedMap[qId].
        // In 'saved' mode: it's saved. If user clicks star, we delete it and remove from list?
        // Let's assume 'saved' mode just shows them. But user might want to remove.
        // For consistency let's use savedMap.

        const isSaved = isSavedView ? true : !!savedMap[qId];

        return (
            <View style={styles.card}>
                <LinearGradient
                    colors={['rgba(30, 41, 59, 0.4)', 'rgba(15, 23, 42, 0.6)']}
                    style={StyleSheet.absoluteFill}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <Text style={[styles.qText, { marginBottom: 0, flex: 1, marginRight: 12 }]}>{index + 1}. {item.text}</Text>
                    <TouchableOpacity onPress={() => handleToggleSave(item, index)}>
                        <Star
                            size={24}
                            color={isSaved ? "#fbbf24" : "#64748b"}
                            fill={isSaved ? "#fbbf24" : "transparent"}
                        />
                    </TouchableOpacity>
                </View>

                {item.options.map((opt, i) => {
                    let btnStyle = styles.option;
                    let textStyle = styles.optionText;

                    if (showResults) {
                        if (item.correctAnswer === opt) {
                            btnStyle = [styles.option, { borderColor: '#10b981', backgroundColor: '#10b98120' }];
                            textStyle = [styles.optionText, { color: '#10b981', fontWeight: 'bold' }];
                        } else if (isSelected(opt) && item.correctAnswer !== opt) {
                            btnStyle = [styles.option, { borderColor: '#ef4444', backgroundColor: '#ef444420' }];
                            textStyle = [styles.optionText, { color: '#ef4444' }];
                        } else {
                            btnStyle = [styles.option, { opacity: 0.4 }];
                        }
                    } else if (isSelected(opt)) {
                        btnStyle = [styles.option, styles.optionSelected];
                        textStyle = styles.optionTextSelected;
                    }

                    return (
                        <TouchableOpacity
                            key={i}
                            style={btnStyle}
                            onPress={() => handleSelectOption(qId, opt)}
                            disabled={showResults}
                        >
                            <Text style={textStyle}>{opt}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    if (loading) {
        return (
            <ScreenWrapper style={styles.center}>
                <ActivityIndicator size="large" color="#8b5cf6" />
                <Text style={{ marginTop: 16, color: '#94a3b8' }}>Generating Test...</Text>
            </ScreenWrapper>
        );
    }

    if (mode === 'taking' && testData) {
        return (
            <ScreenWrapper>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => { setMode('menu'); setTestData(null); setShowResults(false); setAnswers({}); setSavedMap({}); setIsSavedView(false); }} style={styles.backBtn}>
                        <ChevronLeft color="#ef4444" size={24} />
                    </TouchableOpacity>
                    <View style={{ flex: 1, marginLeft: 16 }}>
                        <Text style={styles.headerTitle} numberOfLines={1}>{testData.title}</Text>
                        {isSavedView && filterSessionId && (
                            <Text style={{ color: '#94a3b8', fontSize: 12 }}>Filtered by Session</Text>
                        )}
                    </View>
                </View>

                {/* Session Filter Bubble Row */}
                {isSavedView && (
                    <View style={{ marginBottom: 10, paddingHorizontal: 16 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                            <TouchableOpacity
                                style={[styles.filterChip, !filterSessionId && styles.filterChipActive]}
                                onPress={() => handleLoadSaved(null)}
                            >
                                <Text style={[styles.filterText, !filterSessionId && styles.filterTextActive]}>All</Text>
                            </TouchableOpacity>
                            {sessions.map(s => (
                                <TouchableOpacity
                                    key={s._id}
                                    style={[styles.filterChip, filterSessionId === s._id && styles.filterChipActive]}
                                    onPress={() => handleLoadSaved(s._id)}
                                >
                                    <Text style={[styles.filterText, filterSessionId === s._id && styles.filterTextActive]}>
                                        {s.sessionName || s.jobRole}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {showResults && (
                    <View style={styles.resultBanner}>
                        <LinearGradient colors={['#3b82f6', '#2563eb']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                        <Text style={styles.resultTitle}>Score: {calculateScore()} / {testData.questions.length}</Text>
                    </View>
                )}

                <FlatList
                    data={testData.questions}
                    renderItem={renderQuestion}
                    keyExtractor={(item, index) => (item.id || index).toString()}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={{ color: '#94a3b8', textAlign: 'center', marginTop: 50 }}>No questions found.</Text>}
                    ListFooterComponent={
                        testData.questions.length > 0 ? ( // Only show submit if NOT in saved view? Or allow practicing saved questions?
                            // User can practice saved questions too.
                            !showResults ? (
                                <TouchableOpacity
                                    style={styles.submitBtn}
                                    onPress={() => setShowResults(true)}
                                    disabled={Object.keys(answers).length === 0}
                                >
                                    <LinearGradient colors={['#3b82f6', '#2563eb']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                                    <Text style={styles.submitText}>Submit Test</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={styles.submitBtn}
                                    onPress={() => { setMode('menu'); setTestData(null); setShowResults(false); setAnswers({}); setSavedMap({}); setIsSavedView(false); }}
                                >
                                    <LinearGradient colors={['#10b981', '#059669']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                                    <Text style={styles.submitText}>Done</Text>
                                </TouchableOpacity>
                            )
                        ) : null
                    }
                />
                {toastMsg && (
                    <View style={styles.toast}>
                        <CheckCircle2 size={16} color="white" style={{ marginRight: 8 }} />
                        <Text style={styles.toastText}>{toastMsg}</Text>
                    </View>
                )}
            </ScreenWrapper>
        );
    }

    // MENU MODE
    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Test Module</Text>
                <Text style={styles.subtitle}>Validate your knowledge</Text>

                <View style={styles.menuCard}>
                    <LinearGradient
                        colors={['rgba(30, 41, 59, 0.6)', 'rgba(15, 23, 42, 0.8)']}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                        <View style={[styles.iconBox, { backgroundColor: '#3b82f620', marginBottom: 0, marginRight: 16 }]}>
                            <BrainCircuit size={32} color="#3b82f6" />
                        </View>
                        <View>
                            <Text style={styles.menuTitle}>AI Power Test</Text>
                            <Text style={styles.menuDesc}>Generate a random 5-question test for {jobRole} ({difficulty})</Text>
                        </View>
                    </View>

                    <OptionSelector
                        label="Difficulty"
                        options={['Easy', 'Medium', 'Hard']}
                        selected={difficulty}
                        onSelect={setDifficulty}
                    />

                    <OptionSelector
                        label="Questions"
                        options={[5, 10, 15]}
                        selected={questionCount}
                        onSelect={setQuestionCount}
                    />

                    <TouchableOpacity style={styles.generateBtn} onPress={handleGenerateRandom}>
                        <LinearGradient colors={['#3b82f6', '#2563eb']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                        <Text style={styles.generateBtnText}>Start Test</Text>
                        <PlayCircle size={20} color="white" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.menuCard} onPress={() => handleLoadSaved(null)}>
                    <LinearGradient
                        colors={['rgba(30, 41, 59, 0.6)', 'rgba(15, 23, 42, 0.8)']}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={[styles.iconBox, { backgroundColor: '#10b98120' }]}>
                        <Star size={32} color="#10b981" />
                    </View>
                    <Text style={styles.menuTitle}>Saved Questions</Text>
                    <Text style={styles.menuDesc}>Practice questions you've saved</Text>
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scroll: { padding: 24 },
    list: { padding: 16, gap: 16, paddingBottom: 100 },
    title: { fontSize: 28, fontWeight: 'bold', color: 'white' },
    subtitle: { fontSize: 16, color: '#94a3b8', marginBottom: 32 },

    // Selectors
    selectorLabel: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', marginBottom: 8, textTransform: 'uppercase' },
    selectorRow: { flexDirection: 'row', gap: 8 },
    selectorBtn: { flex: 1, paddingVertical: 10, paddingHorizontal: 4, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center' },
    selectorBtnActive: { backgroundColor: '#3b82f620', borderColor: '#3b82f6' },
    selectorText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
    selectorTextActive: { color: '#3b82f6', fontWeight: 'bold' },

    generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 12, marginTop: 8, overflow: 'hidden' },
    generateBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    // Menu Cards
    menuCard: { padding: 24, borderRadius: 24, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    iconBox: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    menuTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 6, color: 'white' },
    menuDesc: { color: '#94a3b8' },

    // Filter Styles
    filterChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', marginRight: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    filterChipActive: { backgroundColor: '#3b82f620', borderColor: '#3b82f6' },
    filterText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
    filterTextActive: { color: '#3b82f6', fontWeight: 'bold' },

    // Test Taking
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 0, color: 'white' },
    card: { padding: 20, borderRadius: 20, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    qText: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, lineHeight: 28, color: 'white' },

    option: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 10, backgroundColor: 'rgba(15, 23, 42, 0.3)' },
    optionSelected: { borderColor: '#3b82f6', backgroundColor: '#3b82f620' },
    optionText: { color: '#cbd5e1', fontSize: 16 },
    optionTextSelected: { color: '#60a5fa', fontWeight: 'bold' },

    submitBtn: { padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 16, marginBottom: 40, overflow: 'hidden' },
    submitText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    resultBanner: { padding: 20, alignItems: 'center', margin: 16, borderRadius: 16, overflow: 'hidden' },
    resultTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' },

    toast: { position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: 'rgba(16, 185, 129, 0.9)', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 24, flexDirection: 'row', alignItems: 'center', elevation: 5 },
    toastText: { color: 'white', fontWeight: 'bold' }
});
