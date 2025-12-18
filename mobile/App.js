import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { View, ActivityIndicator } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import ClientsScreen from './screens/ClientsScreen';
import ClientFormScreen from './screens/ClientFormScreen';
import ServiceOrdersScreen from './screens/ServiceOrdersScreen';
import ServiceOrderFormScreen from './screens/ServiceOrderFormScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function ClientsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ClientsList"
        component={ClientsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClientForm"
        component={ClientFormScreen}
        options={{ title: 'Cliente' }}
      />
    </Stack.Navigator>
  );
}

function ServiceOrdersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ServiceOrdersList"
        component={ServiceOrdersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ServiceOrderForm"
        component={ServiceOrderFormScreen}
        options={{ title: 'Ordem de Serviço' }}
      />
    </Stack.Navigator>
  );
}

function MainDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#ffffff',
        },
        drawerActiveTintColor: '#2563eb',
        drawerInactiveTintColor: '#6b7280',
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: '📊 Dashboard' }}
      />
      <Drawer.Screen
        name="Clients"
        component={ClientsStack}
        options={{ title: '👥 Clientes' }}
      />
      <Drawer.Screen
        name="ServiceOrders"
        component={ServiceOrdersStack}
        options={{ title: '📝 Ordens de Serviço' }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainDrawer} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
