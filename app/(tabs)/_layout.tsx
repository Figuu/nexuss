import { Tabs } from "expo-router";
import React from "react";

import { Image, Text, View } from "react-native";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Colors } from "../../constants/Colors";
import { TabBarIcon } from "../../components/navigation/TabBarIcon";

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
              <TabBarIcon
                name={focused ? "FaTicketSimple" : "ticket-simple"}
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
              <TabBarIcon name={focused ? "ticket" : "ticket"} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tickets"
          options={{
            title: "Tickets",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? "ticket" : "ticket"} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? "user" : "user"} color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
