import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/component/shared/home/Header";
import Category from "@/component/shared/home/Category";
import LatestPost from "@/component/shared/home/LatestPost";
import axios from "axios";

export default function Home() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    GetPost();
  }, []);
  const GetPost = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        process.env.EXPO_PUBLIC_HOST_URL + "/post?club=0&orderField=post.id"
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <FlatList
      data={[]}
      renderItem={null}
      onRefresh={GetPost}
      refreshing={loading}
      ListHeaderComponent={
        <View
          style={{
            padding: 20,
            paddingTop: 40,
          }}
        >
          <Header />
          <Category />
          {/* latest post */}
          <LatestPost />
        </View>
      }
    />
  );
}
