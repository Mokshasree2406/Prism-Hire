import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { FileText, UploadCloud, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenWrapper from '../components/ScreenWrapper';
import api from '../lib/api';

export default function ResumeScreen() {
    const [file, setFile] = useState(null);
    const [role, setRole] = useState('Frontend Developer');
    const [desc, setDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const pickDocument = async () => {
        try {
            const res = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'application/msword', 'text/plain'],
                copyToCacheDirectory: true
            });

            if (!res.canceled) {
                setFile(res.assets[0]);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAnalyze = async () => {
        if (!file || !role || !desc) {
            Alert.alert("Missing Fields", "Please upload a resume and fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('resume', {
                uri: file.uri,
                name: file.name,
                type: file.mimeType || 'application/pdf'
            });
            formData.append('role', role);
            formData.append('jobDescription', desc);

            const res = await api.post('/resume/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                transformRequest: (data) => data
            });

            setResult(res.data);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to analyze resume.");
        } finally {
            setLoading(false);
        }
    };

    if (result) {
        return (
            <ScreenWrapper>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <TouchableOpacity onPress={() => setResult(null)} style={styles.backBtn}>
                        <ArrowLeft color="#fff" size={24} />
                        <Text style={styles.backText}>Check Another</Text>
                    </TouchableOpacity>

                    <View style={styles.scoreCard}>
                        <LinearGradient colors={['#f59e0b', '#d97706']} style={StyleSheet.absoluteFill} />
                        <Text style={styles.scoreTitle}>ATS Score</Text>
                        <Text style={styles.scoreValue}>{result.atsScore || 0}</Text>
                        <Text style={styles.scoreMax}>/100</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Analysis Summary</Text>
                        <Text style={styles.text}>{result.summary}</Text>
                    </View>

                    {result.suggestions && result.suggestions.length > 0 && (
                        <View style={[styles.card, { marginTop: 16 }]}>
                            <Text style={styles.cardTitle}>Improvements Actions</Text>
                            {result.suggestions.map((suggestion, index) => (
                                <View key={index} style={styles.suggestionRow}>
                                    <View style={styles.bullet} />
                                    <Text style={styles.suggestionText}>{suggestion}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    <View style={{ height: 100 }} />
                </ScrollView>
            </ScreenWrapper>
        );
    }

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.title}>Resume Optimizer</Text>
                <Text style={styles.subtitle}>Get your ATS Score</Text>

                <TouchableOpacity style={styles.uploadArea} onPress={pickDocument}>
                    {file ? (
                        <View style={{ alignItems: 'center' }}>
                            <FileText size={48} color="#3b82f6" style={{ marginBottom: 10 }} />
                            <Text style={styles.fileName}>{file.name}</Text>
                            <Text style={styles.changeFile}>Tap to change</Text>
                        </View>
                    ) : (
                        <View style={{ alignItems: 'center' }}>
                            <UploadCloud size={48} color="#64748b" style={{ marginBottom: 10 }} />
                            <Text style={styles.uploadText}>Upload Resume</Text>
                            <Text style={styles.uploadSub}>PDF, DOCX</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.form}>
                    <Text style={styles.label}>Target Job</Text>
                    <TextInput
                        style={styles.input}
                        value={role}
                        onChangeText={setRole}
                        placeholderTextColor="#64748b"
                    />

                    <Text style={styles.label}>Job Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={desc}
                        onChangeText={setDesc}
                        multiline
                        numberOfLines={4}
                        placeholderTextColor="#64748b"
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleAnalyze}
                        disabled={loading}
                    >
                        <LinearGradient colors={['#3b82f6', '#2563eb']} style={StyleSheet.absoluteFill} />
                        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Scan Resume</Text>}
                    </TouchableOpacity>
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    scroll: { padding: 24 },
    title: { fontSize: 28, fontWeight: 'bold', color: 'white' },
    subtitle: { fontSize: 16, color: '#94a3b8', marginBottom: 32 },

    uploadArea: { height: 180, borderRadius: 24, borderWidth: 2, borderColor: '#3b82f640', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: 24, backgroundColor: 'rgba(59, 130, 246, 0.05)' },
    uploadText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
    uploadSub: { color: '#94a3b8' },
    fileName: { fontSize: 16, fontWeight: 'bold', color: '#3b82f6' },
    changeFile: { color: '#64748b', fontSize: 12 },

    label: { fontSize: 14, fontWeight: '600', color: '#cbd5e1', marginBottom: 6, marginTop: 12 },
    input: { backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', color: 'white', fontSize: 16 },
    textArea: { height: 100, textAlignVertical: 'top' },

    button: { height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 24, overflow: 'hidden' },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 8 },
    backText: { color: 'white', fontWeight: 'bold' },
    scoreCard: { height: 160, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 24, overflow: 'hidden' },
    scoreTitle: { color: 'rgba(255,255,255,0.8)', fontWeight: 'bold', textTransform: 'uppercase' },
    scoreValue: { color: 'white', fontSize: 64, fontWeight: 'bold' },
    scoreMax: { color: 'rgba(255,255,255,0.6)' },

    card: { padding: 24, backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: 24 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 12 },
    text: { color: '#cbd5e1', lineHeight: 22 },
    suggestionRow: { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start' },
    bullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3b82f6', marginTop: 8, marginRight: 8 },
    suggestionText: { flex: 1, color: '#e2e8f0', lineHeight: 22 }
});
