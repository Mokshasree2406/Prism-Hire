import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SessionContext } from '../context/SessionContext';
import { ThemeContext } from '../context/ThemeContext';
import { Briefcase, TrendingUp } from 'lucide-react-native';

export default function OnboardingScreen() {
    const { createSession } = useContext(SessionContext);
    const { colors } = useContext(ThemeContext);

    const [sessionName, setSessionName] = useState('');
    const [jobRole, setJobRole] = useState('');
    const [yearsOfExperience, setYearsOfExperience] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateSession = async () => {
        if (!sessionName.trim() || !jobRole.trim()) {
            Alert.alert("Error", "Please fill in Session Name and Job Role");
            return;
        }

        setIsSubmitting(true);
        try {
            await createSession({
                sessionName: sessionName.trim(),
                jobRole: jobRole.trim(),
                yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : 0,
                topicsToFocus: '',
                jobDescription: ''
            });
            // No navigation needed - App.js will automatically show MainTabs once session is created
        } catch (error) {
            Alert.alert("Error", "Failed to create session. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <LinearGradient
                colors={['#0f172a', '#1e293b']}
                style={StyleSheet.absoluteFill}
            />

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Briefcase size={64} color={colors.primary} />
                    <Text style={[styles.title, { color: colors.text }]}>Welcome to Prism Hire!</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Let's set up your first career goal
                    </Text>
                </View>

                <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.label, { color: colors.text }]}>Session Name *</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
                        placeholder="e.g., Frontend Developer Role"
                        placeholderTextColor={colors.placeholder}
                        value={sessionName}
                        onChangeText={setSessionName}
                    />

                    <Text style={[styles.label, { color: colors.text }]}>Target Job Role *</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
                        placeholder="e.g., React Developer"
                        placeholderTextColor={colors.placeholder}
                        value={jobRole}
                        onChangeText={setJobRole}
                    />

                    <Text style={[styles.label, { color: colors.text }]}>Years of Experience (optional)</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
                        placeholder="e.g., 2"
                        placeholderTextColor={colors.placeholder}
                        value={yearsOfExperience}
                        onChangeText={setYearsOfExperience}
                        keyboardType="numeric"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, isSubmitting && styles.buttonDisabled]}
                    onPress={handleCreateSession}
                    disabled={isSubmitting}
                >
                    <LinearGradient
                        colors={['#3b82f6', '#8b5cf6']}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <TrendingUp size={20} color="white" />
                                <Text style={styles.buttonText}>Start My Journey</Text>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                <Text style={[styles.info, { color: colors.textSecondary }]}>
                    You can always create more sessions and switch between them later!
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 24, paddingTop: 40 },
    header: { alignItems: 'center', marginBottom: 40 },
    title: { fontSize: 28, fontWeight: 'bold', marginTop: 16, marginBottom: 8, textAlign: 'center' },
    subtitle: { fontSize: 16, textAlign: 'center', lineHeight: 24 },

    card: { borderRadius: 20, padding: 24, borderWidth: 1, marginBottom: 24 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 16 },
    input: { borderRadius: 12, padding: 14, fontSize: 16, borderWidth: 1 },

    button: { borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
    buttonGradient: { padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    info: { textAlign: 'center', fontSize: 13, lineHeight: 20 }
});
