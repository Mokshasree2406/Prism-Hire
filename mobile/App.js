import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { SessionContext } from './src/context/SessionContext';
import { ActivityIndicator, View } from 'react-native';
import { Home, ClipboardList, FileText, MessageSquare, BrainCircuit, User } from 'lucide-react-native';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import MobileAIHub from './src/screens/AIHubScreen'; // Renamed to avoid confusion
import TestScreen from './src/screens/TestScreen';
import ResumeScreen from './src/screens/ResumeScreen';
import InterviewScreen from './src/screens/InterviewScreen';
import CustomTabBar from './src/components/CustomTabBar';
import ProfileScreen from './src/screens/ProfileScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { position: 'absolute' } // Important for transparent/floating effect
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Test"
        component={TestScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Interview"
        component={InterviewScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Resume"
        component={ResumeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <FileText color={color} size={size} />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }}
      />
      {/* Hidden tabs or accessible via other means if needed, 
                but keeping standard 5 items for bottom bar is best. 
                Moving AI Hub to Dashboard access only or replacig one? 
                Let's keep AI Hub available via Dashboard cards as it's a "Tool" 
                and Profile is more standard for a Tab. 
                Wait, user asked for "AI Interview Hub" in physical device check. 
                Let's add AI Hub as a tab if space permits, or better yet, 
                Dashboard links to it. Profile is better for the 5th tab. */}
    </Tab.Navigator>
  );
}

function AppNavigation() {
  const { user, loading } = useContext(AuthContext);
  const { sessions, loading: sessionsLoading } = useContext(SessionContext);

  if (loading || (user && sessionsLoading)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Check if user has sessions
          sessions.length === 0 ? (
            // Force onboarding if no sessions
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          ) : (
            // Show main app if sessions exist
            <>
              <Stack.Screen name="Main" component={MainTabs} />
              <Stack.Screen name="AIHub" component={MobileAIHub} />
            </>
          )
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { UIProvider } from './src/context/UIContext';
import { SessionProvider } from './src/context/SessionContext';
import { ThemeProvider } from './src/context/ThemeContext';

export default function App() {
  return (
    <AuthProvider>
      <SessionProvider>
        <UIProvider>
          <ThemeProvider>
            <AppNavigation />
          </ThemeProvider>
        </UIProvider>
      </SessionProvider>
    </AuthProvider>
  );
}
