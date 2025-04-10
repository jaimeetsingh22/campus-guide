import { View, Text, Image, Pressable, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { getContext } from "@/context/ContextProvider";
import UserAvatar from "./UserAvatar";

export default function PostCard({ post }: any) {
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const { user } = getContext();

  useEffect(() => {
    if (user?.email) {
      fetchLikes();
      fetchComments();
    }
  }, [user]);

  const fetchLikes = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_HOST_URL}/like?postid=${post.post_id}`
      );

      // data = array of likes for this post
      setLikeCount(data.length);

      const isLiked = data?.some(
        (like: any) => like.user_email === user?.email
      );
      setLiked(isLiked);
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`${process.env.EXPO_PUBLIC_HOST_URL}/like`, {
        postId: post.post_id,
        userEmail: user?.email,
      });

      // Toggle state locally
      if (liked) {
        setLikeCount((prev) => prev - 1);
      } else {
        setLikeCount((prev) => prev + 1);
      }

      setLiked((prev) => !prev);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_HOST_URL}/comment?postid=${post.post_id}`
      );
      setCommentCount(data?.length || 0);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  return (
    <View
      style={{
        padding: 15,
        marginTop: 10,
        borderRadius: 9,
        backgroundColor: "#fff",
      }}
    >
      <UserAvatar
        name={post?.name}
        image={post?.image}
        date={post?.createdon}
      />
      <Text style={{ fontSize: 18, marginTop: 10 }}>{post.content}</Text>

      {post.imageurl && (
        <Image
          source={{ uri: post.imageurl }}
          style={{ width: "100%", height: 300, borderRadius: 10, marginTop: 5 }}
        />
      )}

      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 15,
        }}
      >
        <TouchableOpacity
          onPress={handleLike}
          style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
        >
          <AntDesign
            name={liked ? "like1" : "like2"}
            size={24}
            color={liked ? "blue" : "black"}
          />
          <Text style={{ fontSize: 17, color: "grey" }}>{likeCount}</Text>
        </TouchableOpacity>

        <Link
          href={{
            pathname: "/comments/[id]",
            params: { id: post.post_id.toString() },
          }}
          asChild
        >
          <Pressable
            style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
          >
            <MaterialCommunityIcons
              name="comment-text-outline"
              size={24}
              color="black"
            />
            <Text style={{ fontSize: 17, color: "grey" }}>{commentCount}</Text>
          </Pressable>
        </Link>
      </View>

      <Link
        href={{
          pathname: "/comments/[id]",
          params: { id: post.post_id.toString() },
        }}
        asChild
      >
        <Pressable>
          <Text style={{ color: "grey", marginTop: 5 }}>View all comments</Text>
        </Pressable>
      </Link>
    </View>
  );
}
