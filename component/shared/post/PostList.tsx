import { View, Text, FlatList, Image } from "react-native";
import React from "react";
import PostCard from "./PostCard";

export default function PostList({ posts, OnRefresh, loading }: any) {
  return (
    <View>
      <FlatList
        data={posts}
        onRefresh={OnRefresh}
        refreshing={loading}
        renderItem={({ item, index }) => <PostCard post={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
