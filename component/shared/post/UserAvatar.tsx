import { View, Text, Image } from "react-native";
import React from "react";
import { getContext } from "@/context/ContextProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment";

interface propsType {
  name: string | undefined;
  image: string | undefined;
  date: string | undefined;
}
export default function UserAvatar({ name, image, date }: propsType) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
        }}
      >
        <Image
          source={{ uri: image }}
          style={{ width: 50, height: 50, borderRadius: 99 }}
        />
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{name}</Text>
          <Text style={{ color: "grey" }}>{moment(date).fromNow()}</Text>
        </View>
      </View>
      <Ionicons name="ellipsis-vertical" size={25} color={"black"} />
    </View>
  );
}
