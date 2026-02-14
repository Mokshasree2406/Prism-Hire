import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import ScreenWrapper from '../components/ScreenWrapper';
import SessionSelector from '../components/SessionSelector';
import { Briefcase, FileText, User, LogOut, Code, Smartphone, BrainCircuit } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function DashboardScreen({ navigation }) {
    const { user, logout } = useContext(AuthContext);
    const { colors, theme } = useContext(ThemeContext);

    const cardBg = theme === 'dark'
        ? ['rgba(30, 41, 59, 0.6)', 'rgba(15, 23, 42, 0.8)']
        : ['rgba(255, 255, 255, 0.8)', 'rgba(241, 245, 249, 0.9)'];

    const ModuleCard = ({ title, desc, icon: Icon, color1, color2, onPress }) => (
        <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
            <LinearGradient
                colors={cardBg}
                style={styles.cardGradient}
            >
                <View style={[styles.iconBox, { borderColor: color1 }]}>
                    <LinearGradient
                        colors={[color1, color2]}
                        style={StyleSheet.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        opacity={0.2}
                    />
                    <Icon size={32} color={color2} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
                    <Text style={[styles.cardDesc, { color: colors.textSecondary }]}>{desc}</Text>
                </View>
                <View style={[styles.arrowBtn, { backgroundColor: `${color1}20` }]}>
                    <Icon size={16} color={color1} />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper>
            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Hero Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greeting, { color: colors.textSecondary }]}>Hello,</Text>
                        <Text style={[styles.username, { color: colors.text }]}>{user?.name?.split(' ')[0] || 'Explorer'}</Text>
                    </View>
                    <TouchableOpacity style={styles.profileBtn} onPress={() => navigation.navigate('Profile')}>
                        <LinearGradient
                            colors={['#3b82f6', '#8b5cf6']}
                            style={styles.profileGradient}
                        >
                            <Text style={styles.profileInitials}>{user?.name?.charAt(0) || 'U'}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <SessionSelector />

                <View style={styles.banner}>
                    <LinearGradient
                        colors={['#4f46e5', '#9333ea']}
                        style={styles.bannerGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={styles.bannerTitle}>Pro Interview Prep</Text>
                            <Text style={styles.bannerSubtitle}>Master your skills with AI</Text>
                        </View>
                        <BrainCircuit size={48} color="rgba(255,255,255,0.3)" />
                    </LinearGradient>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Tools & Resources</Text>

                <View style={styles.grid}>
                    <ModuleCard
                        title="AI Hub"
                        desc="Generate custom Questions"
                        icon={Briefcase}
                        color1="#3b82f6"
                        color2="#60a5fa"
                        onPress={() => navigation.navigate('AIHub')}
                    />

                    <ModuleCard
                        title="Test Module"
                        desc="Evaluate your knowledge"
                        icon={Code}
                        color1="#10b981"
                        color2="#34d399"
                        onPress={() => navigation.navigate('Test')}
                    />

                    <ModuleCard
                        title="Mock Interview"
                        desc="Live AI Chat Simulation"
                        icon={User}
                        color1="#8b5cf6"
                        color2="#a78bfa"
                        onPress={() => navigation.navigate('Interview')}
                    />

                    <ModuleCard
                        title="Resume ATS"
                        desc="Optimize your CV score"
                        icon={FileText}
                        color1="#f59e0b"
                        color2="#fbbf24"
                        onPress={() => navigation.navigate('Resume')}
                    />
                </View>

                {/* Footer safe space for Tab Bar */}
                <View style={{ height: 100 }} />
            </ScrollView>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    scroll: { padding: 24 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    greeting: { fontSize: 16 },
    username: { fontSize: 32, fontWeight: 'bold' },

    profileBtn: { shadowColor: '#3b82f6', shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
    profileGradient: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
    profileInitials: { color: 'white', fontWeight: 'bold', fontSize: 20 },

    banner: { height: 100, borderRadius: 24, marginBottom: 32, overflow: 'hidden', shadowColor: '#9333ea', shadowOpacity: 0.4, shadowRadius: 15, elevation: 5 },
    bannerGradient: { flex: 1, padding: 24, flexDirection: 'row', alignItems: 'center' },
    bannerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white' },
    bannerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },

    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    grid: { gap: 16 },

    cardContainer: { borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    cardGradient: { padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
    iconBox: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, overflow: 'hidden' },
    cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    cardDesc: { fontSize: 13 },
    arrowBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }
});
