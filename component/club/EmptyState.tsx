import { View, Text, Image } from "react-native";
import React from "react";
import Button from "../shared/Button";
import { useRouter } from "expo-router";

export default function EmptyState() {
  const router = useRouter();
  return (
    <View
      style={{
        alignItems: "center",
        marginTop: 80,
      }}
    >
      <Image
        source={require("../../assets/images/no-club.png")}
        style={{
          width: 200,
          height: 200,
        }}
      />
      <Text
        style={{
          fontSize: 22,
          textAlign: "center",
          color: "grey",
        }}
      >
        You are not following any Teams/Clubs
      </Text>
      <Button
        text={"Explore Clubs/Teams"}
        onClick={() => {
          //@ts-ignore
          router.push("/explore-clubs");
        }}
      />
    </View>
  );
}
