import { View, Text } from "react-native";
import React from "react";
import UserAvatar from "@/component/shared/post/UserAvatar";
import { getContext } from "@/context/ContextProvider";
import WritePost from "@/component/shared/post/WritePost";

export default function AddNewPost() {
  const { user } = getContext();
  return (
    <View style={{ padding: 20 }}>
      <UserAvatar
        name={user?.name}
        date={new Date().toISOString().slice(0, 10)}
        image={user?.image}
      />
      <WritePost />
    </View>
  );
}
