import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send, User, Bot, RefreshCcw } from 'lucide-react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { LinearGradient } from 'expo-linear-gradient';
import { SessionContext } from '../context/SessionContext';
import { UIContext } from '../context/UIContext';
import api from '../lib/api';

export default function InterviewScreen({ navigation }) {
    const { activeSession } = useContext(SessionContext);
    const { setIsTabBarVisible, isTabBarVisible } = useContext(UIContext);
    const insets = useSafeAreaInsets();

    const [jobRole, setJobRole] = useState("Software Engineer");
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const flatListRef = useRef();
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        if (activeSession?.jobRole) {
            setJobRole(activeSession.jobRole);
        }
    }, [activeSession]);

    // Initial greeting
    useEffect(() => {
        setMessages([
            { id: '1', text: `Hello! I'm your AI Interviewer. I see you're applying for the ${jobRole} position. Shall we start?`, sender: 'ai' }
        ]);
    }, [jobRole]);

    // Handle Tab Bar and Keyboard
    useEffect(() => {
        const kShow = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
            setIsTabBarVisible(false); // Hide tab bar when typing
        });
        const kHide = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
            setIsTabBarVisible(true); // Show tab bar when done
        });
        return () => {
            kShow.remove();
            kHide.remove();
            setIsTabBarVisible(true);
        };
    }, []);

    const handleSend = async () => {
        if (!inputText.trim() || loading) return;

        const userMsg = { id: Date.now().toString(), text: inputText, sender: 'user' };
        // Optimistic update
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInputText('');
        setLoading(true);

        setTimeout(() => flatListRef.current?.scrollToEnd(), 100);

        try {
            // Call backend chat endpoint
            const res = await api.post('/v1/chat', {
                messages: newMessages.map(m => ({
                    sender: m.sender,
                    text: m.text
                })), // Send history
                jobRole
            });

            if (res.data && res.data.text) {
                const aiMsg = { id: (Date.now() + 1).toString(), text: res.data.text, sender: 'ai' };
                setMessages(prev => [...prev, aiMsg]);
            }
        } catch (error) {
            console.error(error);
            const errMsg = { id: (Date.now() + 1).toString(), text: "Sorry, I had trouble connecting. Please try again.", sender: 'ai', isError: true };
            setMessages(prev => [...prev, errMsg]);
        } finally {
            setLoading(false);
            setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
        }
    };

    const handleRestart = () => {
        setMessages([
            { id: '1', text: `Hello! I'm your AI Interviewer. I see you're applying for the ${jobRole} position. Shall we start?`, sender: 'ai' }
        ]);
        setInputText('');
    };

    const renderMessage = ({ item }) => {
        const isUser = item.sender === 'user';
        return (
            <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowAi]}>
                {!isUser && (
                    <View style={styles.avatarAi}>
                        <Bot size={16} color="white" />
                    </View>
                )}
                <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAi]}>
                    <Text style={[styles.msgText, isUser ? styles.msgTextUser : styles.msgTextAi]}>{item.text}</Text>
                </View>
                {isUser && (
                    <View style={styles.avatarUser}>
                        <User size={16} color="white" />
                    </View>
                )}
            </View>
        );
    };

    return (
        <ScreenWrapper edges={['top', 'left', 'right']}>
            <View style={styles.header}>
                <View style={{ width: 40 }} />
                <View>
                    <Text style={styles.headerTitle}>Mock Interviewer</Text>
                    <Text style={styles.headerSub}>AI Powered • {jobRole}</Text>
                </View>
                <TouchableOpacity onPress={handleRestart} style={styles.restartBtn}>
                    <RefreshCcw size={22} color="white" />
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                ListFooterComponent={loading && (
                    <View style={styles.typingIndicator}>
                        <View style={styles.avatarAi}>
                            <Bot size={16} color="white" />
                        </View>
                        <View style={[styles.bubble, styles.bubbleAi, { flexDirection: 'row', gap: 4, paddingVertical: 16 }]}>
                            <ActivityIndicator size="small" color="#94a3b8" />
                            <Text style={{ color: '#94a3b8', fontSize: 12 }}>Typing...</Text>
                        </View>
                    </View>
                )}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
                style={{ backgroundColor: '#0f172a' }} // Match input area background
            >
                <View style={[styles.inputArea, { paddingBottom: Math.max(16, insets.bottom + 10) }]}>
                    {/*  Padding includes safe area since we disabled it in ScreenWrapper */}
                    <TextInput
                        style={styles.input}
                        placeholder="Type your answer..."
                        placeholderTextColor="#94a3b8"
                        value={inputText}
                        onChangeText={setInputText}
                        editable={!loading}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, (!inputText.trim() || loading) && styles.sendBtnDisabled]}
                        onPress={handleSend}
                        disabled={!inputText.trim() || loading}
                    >
                        <LinearGradient colors={['#3b82f6', '#2563eb']} style={StyleSheet.absoluteFill} />
                        <Send size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* Spacer if needed (commented out as logic moved to padding) or for tab bar */}
            {isTabBarVisible && <View style={{ height: 60, backgroundColor: '#0f172a' }} />}
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    header: { padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', textAlign: 'center' },
    headerSub: { fontSize: 12, color: '#94a3b8', textAlign: 'center' },
    restartBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)' },

    list: { padding: 16 },
    msgRow: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end', maxWidth: '85%' },
    msgRowUser: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
    msgRowAi: { alignSelf: 'flex-start', justifyContent: 'flex-start' },

    avatarAi: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
    avatarUser: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#64748b', alignItems: 'center', justifyContent: 'center', marginLeft: 8 },

    bubble: { padding: 12, borderRadius: 16 },
    bubbleAi: { backgroundColor: 'rgba(30, 41, 59, 0.8)', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    bubbleUser: { backgroundColor: '#2563eb', borderBottomRightRadius: 4 },

    msgText: { fontSize: 15, lineHeight: 22 },
    msgTextAi: { color: '#e2e8f0' },
    msgTextUser: { color: 'white' },

    typingIndicator: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end', marginLeft: 0 },

    inputArea: { flexDirection: 'row', padding: 16, backgroundColor: '#0f172a', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', alignItems: 'center' },
    input: { flex: 1, backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: 12, borderRadius: 24, fontSize: 16, marginRight: 12, color: 'white', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', maxHeight: 100 },
    sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    sendBtnDisabled: { opacity: 0.5 }
});
