import { View, Text, FlatList, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { getContext } from "@/context/ContextProvider";
import Button from "@/component/shared/Button";

export default function CommentsScreen() {
  const { user } = getContext();
  const { id } = useLocalSearchParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_HOST_URL}/comment?postid=${id}`
      );
      setComments(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    setLoading(true);
    try {
      await axios.post(`${process.env.EXPO_PUBLIC_HOST_URL}/comment`, {
        postId: id,
        userEmail: user?.email, // Replace with actual user email
        comment: newComment,
      });
      setNewComment("");
      setLoading(false);
      fetchComments();
    } catch (error) {
      setLoading(false);
      console.error("Error adding comment:", error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 15 }}>
      <FlatList
        data={comments}
        keyExtractor={(item: any) => item.id.toString()}
        onRefresh={fetchComments}
        refreshing={loading}
        renderItem={({ item }: any) => (
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 14, color: "grey" }}>{item.username}</Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {item.comment}
            </Text>
          </View>
        )}
      />
      <TextInput
        value={newComment}
        onChangeText={setNewComment}
        placeholder="Add a comment..."
        style={{
          borderWidth: 1,
          borderColor: "grey",
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        }}
      />
      <Button
        text="Post Comment"
        onClick={handleAddComment}
        loading={loading}
      />
    </View>
  );
}
