import {
  View,
  Text,
  Dimensions,
  FlatList,
  StyleSheet,
  Pressable,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import Button from "@/component/shared/Button";
import { useRouter } from "expo-router";
import axios from "axios";
import EventCard from "@/component/shared/event/EventCard";
import Color from "@/assets/Color";
import { getContext } from "@/context/ContextProvider";

export type EVENT = {
  id: number;
  name: string;
  bannerurl: string;
  location: string;
  link: string;
  event_date: string;
  event_time: string;
  createdby: string;
  username: string;
};

export default function Event() {
  const { user } = getContext();
  const router = useRouter();

  const [allEvents, setAllEvents] = useState<EVENT[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<EVENT[]>([]);
  const [selected, setSelected] = useState<0 | 1>(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAllEvents = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_HOST_URL}/events`
      );
      setAllEvents(data);
    } catch (error) {
      console.error("Error fetching events", error);
    }
  };

  const fetchRegisteredEvents = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_HOST_URL}/event-register?email=${user?.email}`
      );
      setRegisteredEvents(data);
    } catch (error) {
      console.error("Error fetching registered events", error);
    }
  };

  const fetchAllData = async () => {
    setRefreshing(true);
    await Promise.all([fetchAllEvents(), fetchRegisteredEvents()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const registeredEventIds = useMemo(
    () => registeredEvents.map((e) => e.id),
    [registeredEvents]
  );

  const displayedEvents = selected === 0 ? allEvents : registeredEvents;

  const handleEventUpdate = useCallback(() => {
    fetchAllData();
  }, []);

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>Event</Text>
        <Button text="+" onClick={() => router.push("/add-event")} />
      </View>

      <View style={styles.tabs}>
        {["Upcoming", "Registered"].map((label, index) => (
          <Pressable key={index} onPress={() => setSelected(index as 0 | 1)}>
            <Text
              style={[
                styles.tabText,
                {
                  backgroundColor: selected === index ? Color.primary : "white",
                  color: selected === index ? "white" : "black",
                  borderColor: Color.primary,
                  borderWidth: 1,
                },
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View
        style={{
          height: Dimensions.get("screen").height * 0.75,
        }}
      >
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={displayedEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              isRegistered={registeredEventIds.includes(item.id)}
              onUpdate={handleEventUpdate}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchAllData} />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
    padding: 10,
  },
  tabText: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 50,
    fontSize: 18,
    borderWidth: 1,
  },
  listContainer: {
    paddingBottom: 20,
    minHeight: Dimensions.get("screen").height * 0.7,
  },
});
