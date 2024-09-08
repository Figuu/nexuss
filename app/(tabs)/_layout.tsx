import { Stack, Tabs } from "expo-router";
import React from "react";

import { Image, Text, View } from "react-native";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Colors } from "../../constants/Colors";
import { TabBarIcon } from "../../components/navigation/TabBarIcon";
import { FontAwesome6 } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].tabBackground,
            borderTopWidth: 0,
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
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
          name="tickets"
          options={{
            title: "Tickets",
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
