import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { getContext } from "@/context/ContextProvider";
import * as ImagePicker from "expo-image-picker";
import { upload } from "cloudinary-react-native";
import { cld, options } from "@/config/CloudinaryConfig";
import axios from "axios";
import { useRouter } from "expo-router";
import Button from "@/component/shared/Button";

export default function AddClub() {
  const [clubName, setClubName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectImage, setSelectImage] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = getContext();
  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.5,
    });

    if (!result.canceled) {
      setSelectImage(result.assets[0].uri);
    }
  };

  const onAddClub = async () => {
    if (!clubName.trim() || !description.trim()) {
      alert("All fields are required");
      return;
    }

    if (!selectImage) {
      alert("Please upload a club logo");
      return;
    }

    setLoading(true);
    let uploadedImageUrl = "";

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

      uploadedImageUrl = resultData?.url;

      await axios.post(`${process.env.EXPO_PUBLIC_HOST_URL}/clubs`, {
        clubName,
        about: description,
        imageUrl: uploadedImageUrl,
      });

      // Show alert and redirect on OK
      Alert.alert("Success", "Club added successfully", [
        {
          text: "OK",
          onPress: () => router.replace("/explore-clubs"),
        },
      ]);
    } catch (err) {
      console.error("Club creation failed", err);
      alert("Failed to create club");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={styles.title}>Add New Club</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {!selectImage ? (
          <Image
            source={require("../assets/images/image.png")}
            style={styles.image}
          />
        ) : (
          <Image source={{ uri: selectImage }} style={styles.image} />
        )}
      </TouchableOpacity>

      {selectImage ? (
        <Text
          style={styles.removeText}
          onPress={() => setSelectImage(undefined)}
        >
          Remove the Image
        </Text>
      ) : null}

      <TextInput
        placeholder="Club/Team Name"
        style={styles.input}
        onChangeText={(text) => setClubName(text)}
        value={clubName}
      />

      <TextInput
        placeholder="Write your post here..."
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
        onChangeText={(text) => setDescription(text)}
        value={description}
      />

      <Button text="Add" loading={loading} onClick={onAddClub} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  imageContainer: {
    alignSelf: "center",
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  removeText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
});
