import { Stack, Tabs } from "expo-router";
import React from "react";

import { Image, Text, View } from "react-native";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Colors } from "../../constants/Colors";
import { FontAwesome6 } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { cart } = useCart();
  
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].tabBackground,
            borderTopWidth: 0,
            height: 64,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarLabelStyle: {
              fontWeight: "bold",
              fontSize: 11,
            },
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6
                name={focused ? "house" : "house"}
                size={28}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarLabelStyle: {
              fontWeight: "bold",
              fontSize: 11,
            },
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6
                name={focused ? "magnifying-glass" : "magnifying-glass"}
                size={28}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Carrito",
            tabBarLabelStyle: {
              fontWeight: "bold",
              fontSize: 11,
            },
            tabBarIcon: ({ color, focused }) => (
              <View style={{ position: 'relative' }}>
                <FontAwesome6
                  name={focused ? "shopping-cart" : "shopping-cart"}
                  size={28}
                  color={color}
                />
                {cartItemCount > 0 && (
                  <View style={{
                    position: 'absolute',
                    top: -5,
                    right: -8,
                    backgroundColor: '#ef4444',
                    borderRadius: 10,
                    minWidth: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: Colors[colorScheme ?? "light"].tabBackground,
                  }}>
                    <Text style={{
                      color: 'white',
                      fontSize: 10,
                      fontWeight: 'bold',
                    }}>
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="tickets"
          options={{
            title: "Tickets",
            tabBarLabelStyle: {
              fontWeight: "bold",
              fontSize: 11,
            },
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6
                name={focused ? "ticket" : "ticket"}
                size={28}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarLabelStyle: {
              fontWeight: "bold",
              fontSize: 11,
            },
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome6
                name={focused ? "user-large" : "user-large"}
                size={28}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
