import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import { EVENT } from "@/app/(tabs)/Event";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment";
import Button from "../Button";
import axios from "axios";
import { getContext } from "@/context/ContextProvider";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

type Props = {
  event: EVENT;
  isRegistered: boolean;
  onUpdate?: () => void;
};

export default function EventCard({ event, isRegistered, onUpdate }: Props) {
  const { user } = getContext();
  const [registered, setRegistered] = useState(isRegistered);
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    Alert.alert("Register for Event", "Do you want to register?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: async () => {
          setLoading(true);
          try {
            await axios.post(
              `${process.env.EXPO_PUBLIC_HOST_URL}/event-register`,
              {
                eventId: event.id,
                userEmail: user?.email,
              }
            );
            setRegistered(true);
            setLoading(false);
            ToastAndroid.show("Registered!", ToastAndroid.SHORT);
            onUpdate?.();
          } catch {
            Alert.alert("Error", "Could not register.");
          }
        },
      },
    ]);
  };

  const OnPressUnregistered = () => {
    Alert.alert("Unregistered!", "Are you sure you want to unregister?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => handleUnregister(),
      },
    ]);
  };

  const handleUnregister = async () => {
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.EXPO_PUBLIC_HOST_URL}/event-register?eventId=${event.id}&userEmail=${user?.email}`
      );
      setRegistered(false);
      setLoading(false);
      ToastAndroid.show("Unregistered!", ToastAndroid.SHORT);
      onUpdate?.();
    } catch {
      Alert.alert("Error", "Could not unregister.");
    }
  };

  const handleShare = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + "shared-image.jpg";
      const { uri } = await FileSystem.downloadAsync(event.bannerurl, fileUri);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          dialogTitle: "Check out this Image!",
          mimeType: "image/jpeg",
          UTI: "public.jpeg",
        });
      } else {
        Alert.alert("Sharing not supported on this device.");
      }
    } catch {
      Alert.alert("Error", "Sharing failed.");
    }
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: event.bannerurl }} style={styles.image} />
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.subtitle}>Event By {event.username}</Text>
      <Text style={styles.descLabel}>Description:</Text>
      <Text>{event.link}</Text>

      <View style={styles.subContainer}>
        <Ionicons name="location-outline" size={22} color="grey" />
        <Text style={styles.textGray}>{event.location}</Text>
      </View>

      <View style={styles.subContainer}>
        <Ionicons name="calendar-outline" size={22} color="grey" />
        <Text style={styles.textGray}>
          {moment(event.event_date).format("DD MMM YYYY")} at{" "}
          {moment(event.event_time).format("hh:mm a")}
        </Text>
      </View>

      {registered ? (
        <Button
          text={"Unregister"}
          onClick={OnPressUnregistered}
          outLine={true}
          style={{ width: "100%" }}
          loading={loading}
        />
      ) : (
        <>
          <View style={styles.buttonRow}>
            <Button
              text={"Share"}
              outLine={true}
              onClick={handleShare}
              style={{ width: 180 }}
            />
            <Button
              text={"Register"}
              onClick={handleRegister}
              style={{ width: 180 }}
              loading={loading}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 10,
  },
  image: {
    height: 240,
    borderRadius: 12,
    backgroundColor: "#000",
    marginBottom: 10,
    objectFit: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 8,
  },
  descLabel: {
    fontSize: 15,
    color: "grey",
    fontWeight: "bold",
    marginTop: 8,
  },
  textGray: {
    color: "grey",
    fontSize: 15,
  },
  subContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
});
