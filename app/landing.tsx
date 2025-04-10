import { View, Text, Image, Dimensions, Pressable } from "react-native";
import React from "react";
import Button from "@/component/shared/Button";
import Color from "@/assets/Color";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

export default function LandingPage() {
  const router = useRouter();

  const imglink =
    "https://www.shutterstock.com/image-photo/group-students-digital-tablet-laptop-600nw-2347371743.jpg";
  return (
    <View style={{ flex: 1 }}>
      <Image
        source={require("../assets/images/login.png")}
        style={{
          width: "100%",
          height: height * 0.5, // 50% of the screen height
          resizeMode: "cover",
        }}
        blurRadius={1}
      />
      <View
        style={{
          backgroundColor: "white",
          padding: 10,
          borderRadius: 10,
          margin: 10,
          height: Dimensions.get("screen").height * 0.45,
        }}
      >
        <Text
          style={{
            fontSize: width < 400 ? 24 : 30,
            fontWeight: "600",
            textAlign: "center",
            marginTop: 30,
          }}
        >
          Welcome To Campus Guid
        </Text>
        <Text
          style={{
            fontSize: width < 400 ? 14 : 18, // Responsive font size
            fontWeight: "400",
            margin: 10,
            textAlign: "center",
            paddingBottom: 10,
          }}
        >
          This is a campus guide app that helps you navigate through the campus
        </Text>
        <Button
          text={"Get Started here"}
          onClick={() => {
            router.push("/(auth)/SignUp");
          }}
        />
        <Pressable
          onPress={() => {
            router.push("/(auth)/SignIn");
          }}
        >
          <Text
            style={{
              fontSize: width < 400 ? 14 : 16, // Responsive font size
              fontWeight: "300",
              color: Color.link,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Already have Account? Click here!
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
