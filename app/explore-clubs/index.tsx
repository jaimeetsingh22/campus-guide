import {
  View,
  Text,
  FlatList,
  ToastAndroid,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ClubCard from "@/component/club/ClubCard";
import Button from "@/component/shared/Button";
import { getContext } from "@/context/ContextProvider";
import { useRouter } from "expo-router";

interface ClubType {
  id: number;
  name: string;
  club_logo: string;
  about: string;
  createdon: string;
}

interface FollowedClubType {
  id: number;
  club_id: number;
  u_email: string;
}

export default function ExploreClubs() {
  const [clubList, setClubList] = useState<ClubType[]>([]);
  const [followedClub, setFollowedClub] = useState<FollowedClubType[]>([]);
  const [listLoading, setListLoading] = useState<boolean>(true); // ⬅️ FlatList-only loading
  const { user } = getContext();
  const router = useRouter();
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setListLoading(true);
      await GetAllClubs();
      await getUserFollowedClubs();
    } catch (error: any) {
      console.log(error.message);
      ToastAndroid.show("Error fetching clubs", ToastAndroid.LONG);
    } finally {
      setListLoading(false);
    }
  };

  const GetAllClubs = async () => {
    const { data } = await axios.get(
      `${process.env.EXPO_PUBLIC_HOST_URL}/clubs`
    );
    setClubList(data);
  };

  const getUserFollowedClubs = async () => {
    if (!user?.email) return;
    const { data } = await axios.get(
      `${process.env.EXPO_PUBLIC_HOST_URL}/clubfollower?u_email=${user?.email}`
    );
    setFollowedClub(data);
  };

  const isFollowed = (clubId: number) => {
    return followedClub.some((item) => item.club_id === clubId);
  };

  return (
    <View>
      {/* Top Section */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          alignItems: "center",
          borderWidth: 1,
          margin: 10,
          borderRadius: 15,
        }}
      >
        <Text style={{ fontSize: 17, color: "grey" }}>
          Create New Teams / Clubs
        </Text>
        <View>
          <Button
            text={"+ Add New"}
            onClick={() => {
              router.push("/add-club");
            }}
          />
        </View>
      </View>

      <View
        style={{
          height: Dimensions.get("screen").height * 0.75,
        }}
      >
        {/* FlatList Section */}
        {listLoading ? (
          <View style={{ paddingVertical: 50 }}>
            <ActivityIndicator size="large" color="blue" />
          </View>
        ) : (
          <FlatList
            data={clubList}
            onRefresh={GetAllClubs}
            refreshing={listLoading}
            renderItem={({ item }) => (
              <ClubCard
                refreshData={getUserFollowedClubs}
                club={item}
                isFollowed={isFollowed(item.id)}
              />
            )}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
      </View>
    </View>
  );
}
