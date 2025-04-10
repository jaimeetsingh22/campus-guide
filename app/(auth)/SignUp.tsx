import {
  View,
  Text,
  TargetedEvent,
  Pressable,
  Image,
  Alert,
  ToastAndroid,
} from "react-native";
import React, { useState } from "react";
import InputField from "@/component/shared/InputField";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Button from "@/component/shared/Button";
import * as ImagePicker from "expo-image-picker";
import Color from "@/assets/Color";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/FirebaseConfig";
import { upload } from "cloudinary-react-native";
import { cld, options } from "@/config/CloudinaryConfig";
import axios from "axios";
import { useRouter } from "expo-router";
import { getContext } from "@/context/ContextProvider";

export default function SignUp() {
  const [name, setName] = useState<string | undefined>("");
  const [email, setEmail] = useState<string | undefined>("");
  const [password, setPassword] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [visiblePassword, setVisiblePassword] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const { user, setUser } = getContext();
  const router = useRouter();
  const passwordRegex: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&?]{8,}$/;
  const isValidPassword: boolean = passwordRegex.test(password);
  const showPasswordError: boolean = !isValidPassword && password.length > 0;

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    if (!profileImage) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.5,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    }
  };

  const submitHandler = (): void => {
    if (!email || !password || !name) {
      // toasting message for empty field
      ToastAndroid.show("Please enter all the field ", ToastAndroid.BOTTOM);
      return;
    }
    if (!profileImage) {
      ToastAndroid.show("add an image", ToastAndroid.BOTTOM);
      return;
    }
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        if (profileImage) {
          await upload(cld, {
            file: profileImage,
            options: options,
            callback: async (err: any, response: any) => {
              if (err) {
                setLoading(false);
                console.log(err);
              }
              if (response) {
                try {
                  const result = await axios.post(
                    process.env.EXPO_PUBLIC_HOST_URL + "/user",
                    {
                      name: name,
                      email: email,
                      image: response?.url,
                    }
                  );

                  if (result.data) {
                    ToastAndroid.show(
                      "User created successfully",
                      ToastAndroid.BOTTOM
                    );
                    setUser({
                      name: name,
                      email: email,
                      image: response?.url,
                    });
                    setLoading(false);
                    router.push("/landing");
                  }
                } catch (error: any) {
                  console.log("error:", error.message);
                  setLoading(false);
                } finally {
                  setLoading(false);
                }
              }
            },
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
        ToastAndroid.show(err?.message, ToastAndroid.BOTTOM);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={{ padding: 15, marginTop: 40 }}>
      <Text
        style={{
          fontSize: 24,
          color: "#333",
          marginBottom: 20,
        }}
      >
        Create New Account
      </Text>
      <View
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Pressable onPress={pickImage}>
          {profileImage ? (
            <View
              style={{
                width: 100,
                height: 100,
                backgroundColor: "grey",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
              }}
            >
              <Image
                source={{ uri: profileImage }}
                alt="profile image"
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 50,
                  objectFit: "contain",
                }}
              />
            </View>
          ) : (
            <View
              style={{
                width: 100,
                height: 100,
                backgroundColor: "grey",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
              }}
            >
              <AntDesign name="user" size={75} color="white" />
            </View>
          )}
          <AntDesign
            name="camera"
            size={24}
            color={Color.primary}
            style={{
              position: "absolute",
              bottom: 5,
              right: 2,
            }}
          />
        </Pressable>
        {profileImage ? (
          <Text
            style={{
              fontSize: 14,
              color: "red",
              marginTop: 10,
            }}
            onPress={() => {
              setProfileImage("");
            }}
          >
            - Remove the Image
          </Text>
        ) : (
          ""
        )}
      </View>
      <InputField
        label="Full Name"
        placeholder="Full name"
        Onchange={(e) => {
          setName(e);
        }}
        value={name}
        type="default"
      />
      <InputField
        label="College email or Student email"
        placeholder="Email"
        Onchange={(e) => {
          setEmail(e);
        }}
        value={email}
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
      {showPasswordError ? (
        <Text
          style={{
            color: "red",
            fontSize: 11,
            marginBottom: 20,
          }}
        >
          Password should be at least 8 characters long and should have at least
          one lowercase letter, one uppercase letter, one digit and one special
          character.
        </Text>
      ) : (
        <></>
      )}

      <Button
        text={"Create Account"}
        loading={loading}
        onClick={submitHandler}
      />
    </View>
  );
}
