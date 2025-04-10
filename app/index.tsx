import { View, ActivityIndicator, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/FirebaseConfig";
import axios from "axios";
import { getContext } from "@/context/ContextProvider";

const IndexHome = () => {
  const { setUser } = getContext();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userData) => {
      if (userData?.email) {
        try {
          const { data } = await axios.get(
            `${process.env.EXPO_PUBLIC_HOST_URL}/user?email=${userData.email}`
          );
          setUser(data);
          router.replace("/(tabs)/Home");
        } catch (error: any) {
          console.error("User fetch error:", error);
          ToastAndroid.show("Error loading user", ToastAndroid.SHORT);
          router.replace("/landing");
        }
      } else {
        router.replace("/landing");
      }
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return null;
};

export default IndexHome;
