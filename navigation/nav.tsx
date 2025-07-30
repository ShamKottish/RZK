// app/navigation/nav.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Public / auth screens
import ForgotPasswordScreen from "../app/forgot-password";
import IndexScreen from "../app/index";
import LoginScreen from "../app/login";
import LogoScreen from "../app/logoscreen";
import SignupScreen from "../app/signup";
import TermsScreen from "../app/terms";

// Tab screens
import AdvisorScreen from "../app/(tabs)/advisor";
import DashboardScreen from "../app/(tabs)/dashboard";
import KhaznaScreen from "../app/(tabs)/khazna";
import SavingsScreen from "../app/(tabs)/savings";
import SettingsScreen from "../app/(tabs)/settings";

export type RootStackParamList = {
  index:            undefined;
  logoscreen:       undefined;
  login:            undefined;
  signup:           undefined;
  "forgot-password":undefined;
  terms:            undefined;
  dashboard:        undefined;
  savings:          undefined;
  advisor:          undefined;
  khazna:           undefined;
  settings:         undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="index"
        screenOptions={{ headerShown: false }}
      >
        {/* Public / Auth */}
        <Stack.Screen name="index"             component={IndexScreen} />
        <Stack.Screen name="logoscreen"        component={LogoScreen} />
        <Stack.Screen name="login"             component={LoginScreen} />
        <Stack.Screen name="signup"            component={SignupScreen} />
        <Stack.Screen name="forgot-password"   component={ForgotPasswordScreen} />
        <Stack.Screen name="terms"             component={TermsScreen} />

        {/* Main Tabs */}
        <Stack.Screen name="dashboard"         component={DashboardScreen} />
        <Stack.Screen name="savings"           component={SavingsScreen} />
        <Stack.Screen name="advisor"           component={AdvisorScreen} />
        <Stack.Screen name="khazna"            component={KhaznaScreen} />
        <Stack.Screen name="settings"          component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
