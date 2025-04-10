import { View, Text, Image, Pressable, ToastAndroid } from "react-native";
import React, { useState } from "react";
import InputField from "@/component/shared/InputField";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Button from "@/component/shared/Button";
import Color from "@/assets/Color";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/FirebaseConfig";
import axios from "axios";
import { getContext } from "@/context/ContextProvider";

export default function SignIn() {
  const imgUrl =
    "https://img.freepik.com/free-vector/college-students-concept-illustration_114360-10205.jpg?t=st=1743427452~exp=1743431052~hmac=2375f9a46d7ddae636cfa00dde9372bd07e59cb28e435515acbd131009bac5c3&w=1380";
  const [visiblePassword, setVisiblePassword] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const { user, setUser } = getContext();
  const onSubmitHandler = () => {
    if (!email || !password) {
      ToastAndroid.show("please enter email or password", ToastAndroid.BOTTOM);
      return;
    }
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (resp) => {
        // console.log(resp);
        if (resp.user.email) {
          setLoading(false);
          // api to fetch user info
          const { data } = await axios.get(
            process.env.EXPO_PUBLIC_HOST_URL + "/user?email=" + resp.user?.email
          );
          setUser(data);
        }
      })
      .catch((err) => {
        setLoading(false);
        ToastAndroid.show("incorrect email or password", ToastAndroid.BOTTOM);
      });
  };
  return (
    <View
      style={{
        padding: 20,
        paddingTop: 60,
      }}
    >
      <View style={{ alignItems: "center", gap: 10 }}>
        <Image
          source={{ uri: imgUrl }}
          style={{
            height: 250,
            width: 250,
            borderRadius: 200,
            objectFit: "cover",
          }}
        />
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>
          SignIn To Campus Guid
        </Text>
      </View>
      <View
        style={{
          width: "90%",
          margin: "auto",
          marginBottom: 20,
        }}
      >
        <InputField
          placeholder="Enter your email"
          value={email}
          Onchange={(e) => {
            setEmail(e);
          }}
          label="Email"
          type="email-address"
        />
        <View>
          <InputField
            label="Password"
            placeholder="password"
            password={visiblePassword}
            Onchange={(e) => {
              setPassword(e);
            }}
            value={password}
            type="default"
          />

          <Pressable
            onPress={() => setVisiblePassword(!visiblePassword)}
            style={{
              position: "absolute",
              bottom: 9,
              right: 7,
            }}
          >
            {visiblePassword ? (
              <FontAwesome name="eye" size={24} color="black" />
            ) : (
              <FontAwesome name="eye-slash" size={24} color="black" />
            )}
          </Pressable>
        </View>
      </View>
      <Button text={"Sign In"} onClick={onSubmitHandler} loading={loading} />
      <Pressable
        onPress={() => {
          router.push("/(auth)/SignUp");
        }}
      >
        <Text
          style={{
            fontSize: 16, // Responsive font size
            fontWeight: "300",
            color: Color.link,
            textAlign: "center",
          }}
        >
          New to Campus Guid! Create Account here!
        </Text>
      </Pressable>
    </View>
  );
}
