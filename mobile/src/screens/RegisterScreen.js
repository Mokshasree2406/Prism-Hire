import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useContext(AuthContext);
    const { colors } = useContext(ThemeContext);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setIsSubmitting(true);
        const res = await register(name, email, password);
        setIsSubmitting(false);

        if (!res.success) {
            Alert.alert("Registration Failed", res.message);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Join Prism Hire today</Text>

                <View style={styles.form}>
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
                        placeholder="Full Name"
                        placeholderTextColor={colors.placeholder}
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
                        placeholder="Email Address"
                        placeholderTextColor={colors.placeholder}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
                        placeholder="Password"
                        placeholderTextColor={colors.placeholder}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        style={[styles.button, isSubmitting && styles.buttonDisabled]}
                        onPress={handleRegister}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.buttonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={[styles.link, { color: colors.primary }]}>Already have an account? Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, justifyContent: 'center', padding: 24 },
    title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 48 },
    form: { gap: 16 },
    input: { padding: 16, borderRadius: 12, borderWidth: 1, fontSize: 16 },
    button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    link: { textAlign: 'center', marginTop: 16, fontSize: 14 }
});
