import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import TabNavigator from './TabNavigator';


import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();

export default function Navigation() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('userRole');
        if (storedRole) setRole(storedRole);
      } catch (e) {
        console.log('Error fetching role', e);
      } finally {
        setLoading(false);
      }
    };
    checkRole();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!role ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
      ) : role === 'superadmin' ? (
  <Stack.Screen name="SuperAdminDashboard" component={SuperAdminDashboard} />
) : role === 'admin' ? (
  <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
) : (
  <Stack.Screen name="UserTabs" component={TabNavigator} />
)}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
