import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Color from "@/assets/Color";
import axios from "axios";
import PostList from "../post/PostList";
import { useRouter } from "expo-router";

export default function LatestPost() {
  const [selected, setSelected] = useState(0);
  const [postData, setPostData] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const GetPost = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        process.env.EXPO_PUBLIC_HOST_URL + "/post?club=0&orderField=post.id"
      );
      setPostData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    GetPost();
  }, []);
  return (
    <View style={{ marginTop: 15 }}>
      <View
        style={{
          flexDirection: "row",
          gap: 8,
        }}
      >
        <Pressable onPress={() => setSelected(0)}>
          <Text
            style={[
              styles.tabText,
              {
                backgroundColor: selected === 0 ? Color.primary : "white",
                color: selected === 0 ? "white" : "black",
              },
            ]}
          >
            Public Posts
          </Text>
        </Pressable>
        <Pressable onPress={() => router.push("/Clubs")}>
          <Text
            style={[
              styles.tabText,
              {
                backgroundColor: "white",
                color: "black",
              },
            ]}
          >
            Club Posts
          </Text>
        </Pressable>
      </View>
      <PostList posts={postData} loading={loading} OnRefresh={GetPost} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabText: {
    padding: 5,
    fontSize: 20,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
});
