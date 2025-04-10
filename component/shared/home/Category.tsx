import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const category = [
  {
    name: "Upcoming Event",
    banner: require("../../../assets/images/event.png"),
    path: "(tabs)/Event",
  },
  {
    name: "Latest Posts",
    banner: require("../../../assets/images/news.png"),
    path: "(tabs)/Home",
  },
  {
    name: "Clubs",
    banner: require("../../../assets/images/clubs.png"),
    path: "(tabs)/Clubs",
  },
  {
    name: "Add New Post",
    banner: require("../../../assets/images/add-post.png"),
    path: "/add-post",
  },
];

export default function Category() {
  const router = useRouter();
  return (
    <View
      style={{
        marginTop: 15,
      }}
    >
      <FlatList
        data={category}
        numColumns={2}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              router.push(item.path);
            }}
            style={styles.cardContainer}
          >
            <Image source={item.banner} style={styles.imageBanner} />
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    margin: 5,
  },
  imageBanner: {
    width: Dimensions.get("screen").width * 0.43,
    height: 80,
    objectFit: "cover",
    borderRadius: 10,
  },
  text: {
    position: "absolute",
    padding: 8,
    color: "white",
    fontSize: 15,
    fontWeight: "400",
  },
});
