import Color from "@/assets/Color";
import { getContext } from "@/context/ContextProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";

export default function TabLayout() {
  const { user } = getContext();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Color.secondary,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Clubs"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Event"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={{ uri: user?.image }}
              style={{
                borderRadius: 99,
                width: size,
                height: size,
                objectFit: "contain",
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
