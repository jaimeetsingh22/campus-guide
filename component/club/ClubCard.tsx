import { View, Text, Image, ToastAndroid } from "react-native";
import React, { useState } from "react";
import Button from "../shared/Button";
import axios from "axios";
import { getContext } from "@/context/ContextProvider";

interface ClubProps {
  club: {
    id: number;
    name: string;
    club_logo: string;
    about: string;
    createdon: string;
  };
  isFollowed: boolean;
  refreshData: () => void;
}

export default function ClubCard({ club, isFollowed, refreshData }: ClubProps) {
  const { user } = getContext();
  const [loading, setLoading] = useState(false);

  const OnFollowButtonClicked = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      if (isFollowed) {
        await axios.delete(
          `${process.env.EXPO_PUBLIC_HOST_URL}/clubfollower?club_id=${club.id}&u_email=${user.email}`
        );
        ToastAndroid.show("Unfollowed successfully", ToastAndroid.SHORT);
      } else {
        await axios.post(`${process.env.EXPO_PUBLIC_HOST_URL}/clubfollower`, {
          u_email: user.email,
          clubId: club.id,
        });
        ToastAndroid.show("Followed successfully", ToastAndroid.SHORT);
      }

      await refreshData(); // Just updates followed state, not full screen
    } catch (error: any) {
      console.log(error.message);
      ToastAndroid.show("Something went wrong", ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        backgroundColor: "white",
        margin: 10,
        alignItems: "center",
        borderRadius: 15,
      }}
    >
      <Image
        source={{ uri: club.club_logo }}
        style={{
          width: 80,
          height: 80,
          borderRadius: 99,
          marginBottom: 10,
        }}
      />
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{club.name}</Text>
      <Text numberOfLines={2} style={{ color: "grey", marginBottom: 10 }}>
        {club.about}
      </Text>

      <Button
        text={isFollowed ? "Unfollow" : "Follow"}
        loading={loading}
        outLine={isFollowed}
        onClick={OnFollowButtonClicked}
      />
    </View>
  );
}
