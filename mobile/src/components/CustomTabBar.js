import React, { useContext, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { UIContext } from '../context/UIContext';
import { ThemeContext } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

export default function CustomTabBar({ state, descriptors, navigation }) {
    const { isTabBarVisible } = useContext(UIContext);
    const { colors } = useContext(ThemeContext);
    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(translateY, {
            toValue: isTabBarVisible ? 0 : 100,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isTabBarVisible]);

    return (
        <Animated.View style={[
            styles.container,
            { transform: [{ translateY }], shadowOpacity: 0.3 }
        ]}>
            <LinearGradient
                colors={['rgba(15, 23, 42, 0.9)', 'rgba(30, 41, 59, 0.95)']}
                style={[styles.blurContainer, { borderColor: 'rgba(255,255,255,0.1)' }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.tabBar}>
                    {state.routes.map((route, index) => {
                        const { options } = descriptors[route.key];
                        const isFocused = state.index === index;

                        const onPress = () => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        const Icon = options.tabBarIcon;

                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.7}
                                onPress={onPress}
                                style={styles.tabItem}
                            >
                                <View style={[styles.iconContainer, isFocused && styles.activeIconContainer]}>
                                    {isFocused && (
                                        <LinearGradient
                                            colors={['#3b82f6', '#8b5cf6']}
                                            style={StyleSheet.absoluteFill}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                        />
                                    )}
                                    {Icon && <Icon color={isFocused ? 'white' : '#64748b'} size={24} />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        elevation: 10,
    },
    blurContainer: {
        borderRadius: 35,
        borderWidth: 1,
        overflow: 'hidden',
    },
    tabBar: {
        flexDirection: 'row',
        height: 70,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    activeIconContainer: {
        shadowColor: "#8b5cf6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        transform: [{ scale: 1.1 }]
    }
});
