import React, { useContext, useRef } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UIContext } from '../context/UIContext';
import { ThemeContext } from '../context/ThemeContext';

export default function ScreenWrapper({ children, style, edges }) {
    const { showTabBar, hideTabBar } = useContext(UIContext);
    const { colors } = useContext(ThemeContext);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dy) > 10;
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy < -30) {
                    showTabBar();
                } else if (gestureState.dy > 30) {
                    hideTabBar();
                }
            },
        })
    ).current;

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]} {...panResponder.panHandlers}>
            <LinearGradient
                colors={['#0f172a', '#1e293b']}
                style={StyleSheet.absoluteFill}
            />
            <SafeAreaView style={[styles.safeArea, style]} edges={edges}>
                {children}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 }
});
