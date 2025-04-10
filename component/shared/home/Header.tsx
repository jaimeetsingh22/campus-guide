import { View, Text, Image } from "react-native";
import React from "react";
import Color from "@/assets/Color";
import { getContext } from "@/context/ContextProvider";

export default function Header() {
  const { user } = getContext();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 5,
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 25,
            color: Color.primary,
            fontWeight: "bold",
          }}
        >
          Hey there!
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: Color.secondary,
          }}
        >
          MAKAUT University
        </Text>
      </View>
      <Image
        source={{ uri: user?.image }}
        alt="user Image"
        style={{
          width: 50,
          height: 50,
          borderRadius: 99,
        }}
      />
    </View>
  );
}
