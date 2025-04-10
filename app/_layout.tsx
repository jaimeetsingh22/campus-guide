import { ContextProvider } from "@/context/ContextProvider";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <ContextProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="landing" options={{ headerShown: false }} />
        <Stack.Screen
          name="(auth)/SignUp"
          options={{ headerTransparent: true, headerTitle: "" }}
        />
        <Stack.Screen
          name="(auth)/SignIn"
          options={{ headerTransparent: true, headerTitle: "" }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-post/index"
          options={{ headerTitle: "Add New Post" }}
        />
        <Stack.Screen
          name="explore-clubs/index"
          options={{ headerTitle: "Explore Club" }}
        />
        <Stack.Screen
          name="add-club"
          options={{ headerTitle: "Add New Club" }}
        />
        <Stack.Screen
          name="add-event/index"
          options={{ headerTitle: "Add New Event" }}
        />
        <Stack.Screen
          name="comments/[id]"
          options={{ headerTitle: "Add Comments" }}
        />
      </Stack>
    </ContextProvider>
  );
}
