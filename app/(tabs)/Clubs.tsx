import { View, Text, Dimensions, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import EmptyState from "@/component/club/EmptyState";
import axios from "axios";
import PostList from "@/component/shared/post/PostList";
import { useRouter } from "expo-router";
import Button from "@/component/shared/Button";
import { getContext } from "@/context/ContextProvider";

export default function Clubs() {
  const [followedClubs, setFollowedClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = getContext();
  const router = useRouter();

  useEffect(() => {
    fetchFollowedClubPosts();
  }, []);

  const fetchFollowedClubPosts = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);

      // Step 1: Get followed clubs
      const { data: clubsData } = await axios.get(
        `${process.env.EXPO_PUBLIC_HOST_URL}/clubfollower?u_email=${user?.email}`
      );

      const followedClubIds = clubsData.map((club: any) => club.club_id);

      if (followedClubIds.length === 0) {
        setFollowedClubs([]); // No clubs followed
        setLoading(false);
        return;
      }

      // Step 2: Fetch posts for these clubs
      const clubIdsParam = followedClubIds.join(",");
      const { data: posts } = await axios.get(
        `${process.env.EXPO_PUBLIC_HOST_URL}/post?club=${clubIdsParam}&orderField=post.id`
      );
      setFollowedClubs(posts);
    } catch (error) {
      console.log("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View style={{ padding: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 35, fontWeight: "bold" }}>Clubs</Text>
          <Button
            text="Explore Clubs"
            onClick={() => {
              router.push("/explore-clubs");
            }}
          />
        </View>
        {!loading && followedClubs?.length === 0 && <EmptyState />}
      </View>

      <View
        style={{
          height: Dimensions.get("screen").height * 0.76,
        }}
      >
        <FlatList
          data={[]}
          renderItem={null}
          onRefresh={fetchFollowedClubPosts}
          refreshing={loading}
          ListHeaderComponent={
            <PostList
              posts={followedClubs}
              loading={loading}
              OnRefresh={fetchFollowedClubPosts}
            />
          }
        />
      </View>
    </View>
  );
}
