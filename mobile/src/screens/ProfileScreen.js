import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator, Modal, TextInput, Alert, Appearance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { User, Mail, Shield, LogOut, ChevronRight, Settings, Award, Clock, ChevronLeft, X, Check } from 'lucide-react-native';
import api from '../lib/api';

export default function ProfileScreen({ navigation }) {
    const { user, logout, token } = useContext(AuthContext);
    const { colors } = useContext(ThemeContext);
    const [stats, setStats] = useState({ score: '0%', hours: 0, testsTaken: 0 });
    const [loading, setLoading] = useState(false);

    // Edit Profile State
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [newName, setNewName] = useState(user?.name || '');
    const [saving, setSaving] = useState(false);


    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await api.get('/user/analytics');
            setStats(res.data);
        } catch (error) {
            console.error("Failed to fetch analytics", error);
        }
    };

    const handleUpdateProfile = async () => {
        if (!newName.trim()) return;
        setSaving(true);
        try {
            await api.put('/user/profile', { name: newName });
            Alert.alert("Success", "Profile updated successfully");
            setEditModalVisible(false);
        } catch (error) {
            Alert.alert("Error", "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const gradientColors = ['#0f172a', '#1e293b'];

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <View style={[styles.statCard, { backgroundColor: colors.surfaceHighlight, borderColor: colors.border }]}>
            <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
                <Icon size={20} color={color} />
            </View>
            <View>
                <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
            </View>
        </View>
    );

    const SettingItem = ({ icon: Icon, label, color = '#94a3b8', onPress }) => (
        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]} onPress={onPress}>
            <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: `${color}10` }]}>
                    <Icon size={20} color={color} />
                </View>
                <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <LinearGradient
                colors={gradientColors}
                style={styles.gradient}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.topHeader}>
                    <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
                        <ChevronLeft color={colors.text} size={28} />
                    </TouchableOpacity>
                    <Text style={[styles.screenTitle, { color: colors.text }]}>Profile</Text>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scroll}>
                    {/* Header Profile */}
                    <View style={styles.header}>
                        <View style={styles.avatarContainer}>
                            <LinearGradient
                                colors={['#3b82f6', '#8b5cf6']}
                                style={styles.avatarGradient}
                            >
                                <Text style={styles.avatarText}>
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </Text>
                            </LinearGradient>
                        </View>
                        <Text style={[styles.name, { color: colors.text }]}>{user?.name || 'User Name'}</Text>
                        <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email || 'user@example.com'}</Text>

                        <View style={styles.badge}>
                            <Shield size={12} color={colors.success} />
                            <Text style={[styles.badgeText, { color: colors.success }]}>Verified Student</Text>
                        </View>
                    </View>

                    {/* Stats Grid */}
                    <View style={styles.statsGrid}>
                        <StatCard icon={Award} label="Score" value={stats.score} color="#f59e0b" />
                        <StatCard icon={Clock} label="Hours" value={stats.hours} color="#3b82f6" />
                        <StatCard icon={Award} label="Tests" value={stats.testsTaken} color="#8b5cf6" />
                    </View>

                    {/* Settings Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Settings</Text>
                        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                            <SettingItem icon={User} label="Edit Profile" color="#3b82f6" onPress={() => { setNewName(user?.name); setEditModalVisible(true); }} />
                            <SettingItem icon={Shield} label="Privacy & Security" color={colors.success} onPress={() => Alert.alert("Privacy", "Your data is secure. Password change feature coming soon.")} />
                        </View>
                    </View>

                    {/* Logout */}
                    <TouchableOpacity style={[styles.logoutBtn, { borderColor: `${colors.danger}40`, backgroundColor: `${colors.danger}10` }]} onPress={logout}>
                        <LogOut size={20} color={colors.danger} />
                        <Text style={[styles.logoutText, { color: colors.danger }]}>Sign Out</Text>
                    </TouchableOpacity>

                    <Text style={[styles.version, { color: colors.textSecondary }]}>Version 1.2.0 • Prism Hire</Text>
                </ScrollView>
            </SafeAreaView>

            {/* Edit Profile Modal */}
            <Modal visible={editModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profile</Text>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                <X size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
                                value={newName}
                                onChangeText={setNewName}
                                placeholder="Enter name"
                                placeholderTextColor={colors.placeholder}
                            />
                        </View>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateProfile} disabled={saving}>
                            {saving ? <ActivityIndicator color="white" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradient: { ...StyleSheet.absoluteFillObject },
    safeArea: { flex: 1 },
    topHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
    backButton: { padding: 8, marginLeft: -8 },
    screenTitle: { fontSize: 18, fontWeight: 'bold' },

    scroll: { padding: 24, paddingBottom: 100 },

    header: { alignItems: 'center', marginBottom: 32 },
    avatarContainer: { marginBottom: 16, shadowColor: '#3b82f6', shadowOpacity: 0.3, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } },
    avatarGradient: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 40, fontWeight: 'bold', color: 'white' },
    name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
    email: { fontSize: 14, marginBottom: 12 },
    badge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#10b98120', borderRadius: 20, borderWidth: 1, borderColor: '#10b98140' },
    badgeText: { fontSize: 12, fontWeight: 'bold' },

    statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 32 },
    statCard: { flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, alignItems: 'center', gap: 12 },
    statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    statValue: { fontSize: 20, fontWeight: 'bold' },
    statLabel: { fontSize: 12 },

    section: { marginBottom: 32 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16, marginLeft: 4 },
    card: { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
    settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1 },
    settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    settingLabel: { fontSize: 15, fontWeight: '600' },

    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 18, borderRadius: 16, borderWidth: 1, marginBottom: 32 },
    logoutText: { fontWeight: 'bold', fontSize: 16 },

    version: { textAlign: 'center', fontSize: 12 },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
    modalContent: { borderRadius: 24, padding: 24, borderWidth: 1 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    modalTitle: { fontSize: 20, fontWeight: 'bold' },
    inputGroup: { marginBottom: 24 },
    label: { fontSize: 14, marginBottom: 8, fontWeight: '600' },
    input: { padding: 16, borderRadius: 12, borderWidth: 1, fontSize: 16 },
    saveBtn: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 12, alignItems: 'center' },
    saveBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

    themeOption: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, borderBottomWidth: 1, marginBottom: 8 },
    themeText: { fontSize: 16, fontWeight: '600' }
});
