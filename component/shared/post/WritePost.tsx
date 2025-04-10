import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getContext } from "@/context/ContextProvider";
import DropDownPicker from "react-native-dropdown-picker";
import Button from "../Button";
import * as ImagePicker from "expo-image-picker";
import { upload } from "cloudinary-react-native";
import { cld, options } from "@/config/CloudinaryConfig";
import axios from "axios";
import { useRouter } from "expo-router";

export default function WritePost() {
  const [open, setOpen] = useState<boolean | undefined>(false);
  const [value, setValue] = useState(null);
  const [content, setContent] = useState<string>("");
  const [selectImage, setSelectImage] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = getContext();
  const [item, setItems] = useState([{ label: "Public", value: 0 }]);

  const router = useRouter();

  useEffect(() => {
    getUserFollowedClubs();
  }, []);

  const pickImage = async () => {
    if (!selectImage) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: true,
        aspect: [4, 4],
        quality: 0.5,
      });

      if (!result.canceled) {
        setSelectImage(result.assets[0].uri);
      }
    }
  };

  const onPostButtonClicked = async () => {
    if (!content) {
      ToastAndroid.show("Write something", ToastAndroid.BOTTOM);
      return;
    }
    if (value === null) {
      ToastAndroid.show("Please select where to post", ToastAndroid.BOTTOM);
      return;
    }

    setLoading(true);
    let uploadedImageUrl = "";

    if (selectImage) {
      try {
        const resultData: any = await new Promise(async (resolve, reject) => {
          await upload(cld, {
            file: selectImage,
            options: options,
            callback: (error: any, response: any) => {
              if (error) {
                reject(error);
              } else {
                resolve(response);
              }
            },
          });
        });

        uploadedImageUrl = resultData && resultData?.url;
      } catch (err) {
        console.error("Image upload failed", err);
        ToastAndroid.show("Image upload failed", ToastAndroid.BOTTOM);
        setLoading(false);
        return;
      }
    }

    try {
      await axios.post(process.env.EXPO_PUBLIC_HOST_URL + "/post", {
        content: content,
        imageUrl: uploadedImageUrl,
        visibleIn: value,
        email: user?.email,
      });

      if (value !== 0) router.replace("/Clubs");
      else router.replace("/(tabs)/Home");
    } catch (err) {
      console.error("Post creation failed", err);
      ToastAndroid.show("Failed to post", ToastAndroid.BOTTOM);
    } finally {
      setLoading(false);
    }
  };

  const getUserFollowedClubs = async () => {
    if (!user?.email) return;

    try {
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_HOST_URL}/clubfollower?u_email=${user.email}`
      );

      const clubs = data?.map((item: any) => ({
        label: item?.name,
        value: item?.club_id,
      }));

      const combined = [{ label: "Public", value: 0 }, ...clubs];

      // ✅ Remove duplicates by value
      const unique = Array.from(
        new Map(combined.map((item) => [item.value, item])).values()
      );

      setItems(unique);
    } catch (err) {
      console.error("Error fetching followed clubs", err);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Write your post here..."
        style={styles.textInput}
        multiline={true}
        numberOfLines={5}
        maxLength={1000}
        onChangeText={(value) => setContent(value)}
        value={content}
      />

      <TouchableOpacity onPress={pickImage}>
        {!selectImage ? (
          <Image
            source={require("../../../assets/images/image.png")}
            style={styles.image}
          />
        ) : (
          <Image source={{ uri: selectImage }} style={styles.image} />
        )}
      </TouchableOpacity>

      {selectImage ? (
        <Text
          style={{
            fontSize: 14,
            color: "red",
            marginTop: 10,
          }}
          onPress={() => {
            setSelectImage("");
          }}
        >
          Remove the Image
        </Text>
      ) : null}

      <View style={{ marginTop: 13 }}>
        <DropDownPicker
          items={item}
          //@ts-ignore
          open={open}
          value={value}
          //@ts-ignore
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder={"Choose where to post"}
          style={{
            borderWidth: 0,
            elevation: 2,
          }}
        />
      </View>

      <Button
        text={"Post"}
        loading={loading}
        onClick={() => onPostButtonClicked()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    padding: 10,
    height: 140,
    borderColor: "#ccc",
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 15,
    textAlignVertical: "top",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    marginTop: 10,
    borderWidth: 0.4,
  },
});
