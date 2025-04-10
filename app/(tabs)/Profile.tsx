import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { getContext } from "@/context/ContextProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Route, useRouter } from "expo-router";
import Color from "@/assets/Color";
import { signOut } from "firebase/auth";
import { auth } from "@/config/FirebaseConfig";
// type for profileOptions
type ProfileOptions = {
  name: string;
  path: Route;
  icon: string;
};
// creating array of object of type ProfileOptions

const profileOptions = [
  {
    name: "Add Post",
    path: "/add-post",
    icon: "add-circle-outline",
  },
  {
    name: "My Events",
    path: "/Event",
    icon: "calendar-outline",
  },
  {
    name: "Logout",
    path: "logout",
    icon: "log-out-outline",
  },
];

export default function Profile() {
  const { user, setUser } = getContext();
  const router = useRouter();
  const OnPressOption = (item: any) => {
    if (item.path === "logout") {
      signOut(auth)
        .then(() => {
          setUser(null);
          router.replace("/landing");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      router.push(item.path);
    }
  };
  return (
    <View
      style={{
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
        }}
      >
        Profile
      </Text>
      <View
        style={{
          alignItems: "center",
          marginTop: 30,
        }}
      >
        <Image
          source={{ uri: user?.image }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 99,
          }}
        />
        <Text
          style={{
            fontSize: 25,
            marginTop: 10,
            fontWeight: "bold",
          }}
        >
          {user?.name}
        </Text>
        <Text
          style={{
            marginTop: 7,
            color: "grey",
            fontSize: 18,
          }}
        >
          {user?.email}
        </Text>
      </View>
      <FlatList
        data={profileOptions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }: any) => (
          <TouchableOpacity
            onPress={() => {
              OnPressOption(item);
            }}
            style={{
              flexDirection: "row",
              gap: 8,
              padding: 15,
              margin: 6,
              borderWidth: 0.7,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Ionicons name={item.icon} size={34} color={Color.primary} />
            <Text style={{ fontSize: 20, marginLeft: 10 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
