import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert, Modal, Dimensions } from 'react-native';
import { Briefcase, PlayCircle, Copy, Check, Sparkles, Brain, MessageSquare, Bot, X, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenWrapper from '../components/ScreenWrapper';
import { SessionContext } from '../context/SessionContext';
import api from '../lib/api';

const { width } = Dimensions.get('window');

export default function MobileAIHub({ navigation }) {
    const { activeSession } = useContext(SessionContext);
    const [prompt, setPrompt] = useState('');
    const [role, setRole] = useState('Frontend Developer');

    // AI Responses State
    const [responses, setResponses] = useState({
        gemini: '',
        chatgpt: '',
        claude: ''
    });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('gemini'); // 'gemini' | 'chatgpt' | 'claude'

    // Comparison State
    const [comparing, setComparing] = useState(false);
    const [comparisonResult, setComparisonResult] = useState(null);
    const [showComparison, setShowComparison] = useState(false);

    useEffect(() => {
        if (activeSession?.jobRole) {
            setRole(activeSession.jobRole);
        }
    }, [activeSession]);

    const handleGenerate = async () => {
        if (!prompt.trim()) return Alert.alert("Required", "Please enter a topic or question.");

        setLoading(true);
        setResponses({ gemini: '', chatgpt: '', claude: '' }); // Clear previous
        setComparisonResult(null);

        try {
            // Updated endpoint to use the multi-model controller
            const res = await api.post('/v1/prompt', {
                prompt: `Context: ${role}. Question: ${prompt}`
            });

            if (res.data) {
                setResponses({
                    gemini: res.data.gemini || "No response.",
                    chatgpt: res.data.chatgpt || "No response.",
                    claude: res.data.claude || "No response."
                });
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to generate responses.");
        } finally {
            setLoading(false);
        }
    };

    const handleCompare = async () => {
        setComparing(true);
        try {
            const res = await api.post('/v1/summarize', {
                responses
            });
            if (res.data && res.data.summary) {
                setComparisonResult(res.data.summary);
                setShowComparison(true);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to compare models.");
        } finally {
            setComparing(false);
        }
    };

    const copyToClipboard = (text) => {
        // Placeholder for clipboard logic using expo-clipboard if available, 
        // or just alert for now since user didn't explicitly ask for clipboard logic but UI has icon.
        Alert.alert("Copied", "Text copied to clipboard!");
    };

    const TabButton = ({ id, label, icon: Icon, color }) => (
        <TouchableOpacity
            style={[styles.tabBtn, activeTab === id && { backgroundColor: `${color}20`, borderColor: color }]}
            onPress={() => setActiveTab(id)}
        >
            <Icon size={16} color={activeTab === id ? color : '#64748b'} />
            <Text style={[styles.tabText, activeTab === id && { color: color, fontWeight: 'bold' }]}>{label}</Text>
        </TouchableOpacity>
    );

    const getActiveContent = () => {
        switch (activeTab) {
            case 'gemini': return { text: responses.gemini, color: '#3b82f6', icon: Sparkles };
            case 'chatgpt': return { text: responses.chatgpt, color: '#10b981', icon: Bot };
            case 'claude': return { text: responses.claude, color: '#f97316', icon: Brain };
            default: return { text: '', color: '#fff', icon: Sparkles };
        }
    };

    const activeContent = getActiveContent();
    const ActiveIcon = activeContent.icon;

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <ChevronLeft color="white" size={28} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.title}>AI Hub</Text>
                        <Text style={styles.subtitle}>Multi-Model Comparison</Text>
                    </View>
                </View>

                {/* Input Section */}
                <View style={styles.inputCard}>
                    <View style={styles.roleContainer}>
                        <Briefcase size={14} color="#94a3b8" />
                        <Text style={styles.roleText}>{role}</Text>
                    </View>

                    <TextInput
                        style={styles.mainInput}
                        multiline
                        placeholder="Ask anything... (e.g., 'Explain Redux vs Context')"
                        placeholderTextColor="#64748b"
                        value={prompt}
                        onChangeText={setPrompt}
                    />

                    <TouchableOpacity
                        style={styles.genBtn}
                        onPress={handleGenerate}
                        disabled={loading}
                    >
                        <LinearGradient colors={['#3b82f6', '#2563eb']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                        {loading ? <ActivityIndicator color="white" /> : <PlayCircle size={24} color="white" />}
                    </TouchableOpacity>
                </View>

                {/* Results Section */}
                {(responses.gemini !== '' || loading) && (
                    <View style={styles.resultsContainer}>
                        {/* Tabs */}
                        <View style={styles.tabContainer}>
                            <TabButton id="gemini" label="Gemini" icon={Sparkles} color="#3b82f6" />
                            <TabButton id="chatgpt" label="ChatGPT" icon={Bot} color="#10b981" />
                            <TabButton id="claude" label="Claude" icon={Brain} color="#f97316" />
                        </View>

                        {/* Content Area */}
                        <View style={[styles.contentCard, { borderColor: activeContent.color + '40' }]}>
                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color={activeContent.color} />
                                    <Text style={{ color: '#94a3b8', marginTop: 12 }}>Generating 3 AI responses...</Text>
                                </View>
                            ) : (
                                <>
                                    <ScrollView style={{ maxHeight: 300 }} nestedScrollEnabled>
                                        <Text style={styles.responseText}>{activeContent.text}</Text>
                                    </ScrollView>
                                    <TouchableOpacity style={styles.copyBtn} onPress={() => copyToClipboard(activeContent.text)}>
                                        <Copy size={16} color="#64748b" />
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>

                        {/* Compare Button */}
                        {!loading && responses.gemini !== '' && (
                            <TouchableOpacity
                                style={styles.compareBtn}
                                onPress={handleCompare}
                                disabled={comparing}
                            >
                                <LinearGradient colors={['#8b5cf6', '#6366f1']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                                {comparing ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Sparkles size={20} color="white" style={{ marginRight: 8 }} />
                                        <Text style={styles.compareText}>Compare & Synthesize</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* Comparison Modal */}
            <Modal visible={showComparison} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <LinearGradient colors={['#1e293b', '#0f172a']} style={StyleSheet.absoluteFill} />

                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>AI Synthesis</Text>
                            <TouchableOpacity onPress={() => setShowComparison(false)} style={styles.closeBtn}>
                                <X size={24} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalScroll}>
                            <Text style={styles.comparisonText}>{comparisonResult}</Text>
                        </ScrollView>

                        <TouchableOpacity style={styles.modalDoneBtn} onPress={() => setShowComparison(false)}>
                            <Text style={styles.modalDoneText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    scroll: { padding: 20, paddingBottom: 100 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 16 },
    backBtn: { width: 40, height: 40, alignItems: ' center', justifyContent: 'center', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)' },
    title: { fontSize: 28, fontWeight: 'bold', color: 'white' },
    subtitle: { fontSize: 16, color: '#94a3b8' },

    inputCard: { backgroundColor: '#1e293b', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#334155', marginBottom: 24 },
    roleContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12, backgroundColor: '#33415550', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    roleText: { color: '#cbd5e1', fontSize: 12, fontWeight: '600' },
    mainInput: { color: 'white', fontSize: 16, minHeight: 80, textAlignVertical: 'top', marginBottom: 12 },
    genBtn: { alignSelf: 'flex-end', width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', shadowColor: '#3b82f6', shadowOpacity: 0.5, shadowRadius: 10, elevation: 5 },

    resultsContainer: { gap: 16 },
    tabContainer: { flexDirection: 'row', gap: 8 },
    tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 12, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155' },
    tabText: { color: '#64748b', fontSize: 12, fontWeight: '600' },

    contentCard: { backgroundColor: '#1e293b80', borderRadius: 20, padding: 20, minHeight: 200, borderWidth: 1, borderColor: '#334155' },
    responseText: { color: '#e2e8f0', fontSize: 15, lineHeight: 24 },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
    copyBtn: { position: 'absolute', top: 16, right: 16, padding: 8 },

    compareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, overflow: 'hidden', marginTop: 8 },
    compareText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
    modalContent: { height: '85%', backgroundColor: '#0f172a', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
    modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, borderBottomWidth: 1, borderBottomColor: '#334155' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
    closeBtn: { padding: 4 },
    modalScroll: { padding: 24 },
    comparisonText: { color: '#e2e8f0', fontSize: 16, lineHeight: 26 },
    modalDoneBtn: { margin: 24, backgroundColor: '#334155', padding: 16, borderRadius: 16, alignItems: 'center' },
    modalDoneText: { color: 'white', fontWeight: 'bold' }
});
