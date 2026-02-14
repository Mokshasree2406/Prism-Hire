import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SessionContext } from '../context/SessionContext';
import { ChevronDown, Plus, Check, X, Briefcase, Trash2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SessionSelector() {
    const { sessions, activeSession, switchSession, createSession, deleteSession, loading } = useContext(SessionContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [newRole, setNewRole] = useState('');
    const [newTarget, setNewTarget] = useState('');

    const handleCreate = async () => {
        if (!newRole) return;
        await createSession({
            sessionName: `${newRole}${newTarget ? ' @ ' + newTarget : ''}`,
            jobRole: newRole,
            targetCompany: newTarget,
            jobDescription: ''
        });
        setIsCreating(false);
        setModalVisible(false);
        setNewRole('');
        setNewTarget('');
    };

    const handleDelete = (session) => {
        Alert.alert(
            "Delete Session",
            `Are you sure you want to delete "${session.jobRole}"? This cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteSession(session._id);
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete session");
                        }
                    }
                }
            ]
        );
    };

    return (
        <>
            <TouchableOpacity
                style={styles.container}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={['rgba(59, 130, 246, 0.2)', 'rgba(37, 99, 235, 0.2)']}
                    style={styles.gradient}
                />
                <View style={styles.iconBox}>
                    <Briefcase size={16} color="#60a5fa" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.label}>Current Goal</Text>
                    <Text style={styles.value} numberOfLines={1}>
                        {activeSession ? `${activeSession.jobRole}${activeSession.targetCompany ? ' @ ' + activeSession.targetCompany : ''}` : 'Select a Goal'}
                    </Text>
                </View>
                <ChevronDown size={20} color="#94a3b8" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{isCreating ? 'New Goal' : 'Switch Goal'}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X size={24} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        {isCreating ? (
                            <View style={styles.form}>
                                <Text style={styles.inputLabel}>Target Role</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Product Manager"
                                    placeholderTextColor="#64748b"
                                    value={newRole}
                                    onChangeText={setNewRole}
                                />

                                <Text style={styles.inputLabel}>Target Company (Optional)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Google"
                                    placeholderTextColor="#64748b"
                                    value={newTarget}
                                    onChangeText={setNewTarget}
                                />

                                <View style={styles.actionRow}>
                                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsCreating(false)}>
                                        <Text style={styles.cancelText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.createBtn} onPress={handleCreate} disabled={loading}>
                                        <LinearGradient colors={['#3b82f6', '#2563eb']} style={StyleSheet.absoluteFill} />
                                        {loading ? <ActivityIndicator color="white" /> : <Text style={styles.createText}>Create</Text>}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <>
                                <FlatList
                                    data={sessions}
                                    keyExtractor={item => item._id}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                    renderItem={({ item }) => (
                                        <View style={[styles.sessionItem, activeSession?._id === item._id && styles.activeItem]}>
                                            <TouchableOpacity
                                                style={{ flex: 1 }}
                                                onPress={() => {
                                                    switchSession(item);
                                                    setModalVisible(false);
                                                }}
                                            >
                                                <View>
                                                    <Text style={[styles.sessionRole, activeSession?._id === item._id && styles.activeText]}>
                                                        {item.jobRole}
                                                    </Text>
                                                    {item.targetCompany && (
                                                        <Text style={styles.sessionCompany}>{item.targetCompany}</Text>
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                                {activeSession?._id === item._id && <Check size={20} color="#3b82f6" />}
                                                <TouchableOpacity
                                                    onPress={() => handleDelete(item)}
                                                    style={styles.deleteBtn}
                                                >
                                                    <Trash2 size={18} color="#ef4444" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                    ListEmptyComponent={<Text style={styles.emptyText}>No goals set yet.</Text>}
                                />
                                <TouchableOpacity style={styles.addBtn} onPress={() => setIsCreating(true)}>
                                    <Plus size={20} color="white" />
                                    <Text style={styles.addText}>Add New Goal</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, borderRadius: 16, overflow: 'hidden', padding: 12, borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.3)' },
    gradient: { ...StyleSheet.absoluteFillObject },
    iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    label: { fontSize: 12, color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' },
    value: { fontSize: 16, fontWeight: 'bold', color: 'white' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#1e293b', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, minHeight: 400 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },

    sessionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, backgroundColor: 'rgba(30, 41, 59, 0.5)', marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    activeItem: { borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)' },
    sessionRole: { fontSize: 16, fontWeight: '600', color: '#cbd5e1' },
    activeText: { color: '#3b82f6' },
    sessionCompany: { fontSize: 14, color: '#64748b' },
    deleteBtn: { padding: 8, backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: 8 },
    emptyText: { color: '#94a3b8', textAlign: 'center', marginTop: 20 },

    addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.2)', marginTop: 10, borderWidth: 1, borderColor: '#3b82f640' },
    addText: { color: '#60a5fa', fontWeight: 'bold' },

    form: { gap: 16 },
    inputLabel: { color: '#cbd5e1', fontWeight: '600' },
    input: { backgroundColor: 'rgba(15, 23, 42, 0.5)', padding: 16, borderRadius: 12, color: 'white', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    actionRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
    cancelBtn: { flex: 1, padding: 16, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
    cancelText: { color: '#cbd5e1', fontWeight: 'bold' },
    createBtn: { flex: 1, padding: 16, alignItems: 'center', borderRadius: 12, overflow: 'hidden' },
    createText: { color: 'white', fontWeight: 'bold' }
});
