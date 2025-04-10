import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import InputField from "@/component/shared/InputField";
import { getContext } from "@/context/ContextProvider";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import Button from "@/component/shared/Button";
import moment from "moment";
import axios from "axios";
import { upload } from "cloudinary-react-native";
import { cld, options } from "@/config/CloudinaryConfig";
import { useRouter } from "expo-router";

export default function AddEvent() {
  const { user } = getContext();
  const [selectImage, setSelectImage] = useState<string | undefined>();
  const [eventName, setEventName] = useState<string>("");
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");
  const [time, setTime] = useState("Select Time");
  const [date, setDate] = useState("Select Date");
  const [openTimePicker, setOpenTimePicker] = useState(false);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pickImage = async () => {
    if (!selectImage) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.5,
      });

      if (!result.canceled) {
        setSelectImage(result.assets[0].uri);
      }
    }
  };

  const onChangeTime = (event: any, selectedTime: any) => {
    setOpenTimePicker(false);
    setSelectedTime(selectedTime);
    setTime(moment(selectedTime).format("hh:mm a"));
  };
  const onChangeDate = (event: any, selectedDate: any) => {
    setOpenDatePicker(false);

    setSelectedDate(selectedDate);
    setDate(moment(selectedDate).format("DD MMM YYYY"));
  };

  const OnSubmitPress = async () => {
    if (!eventName || !location || !link || !time || !date || !selectImage) {
      ToastAndroid.show("Please fill all the fields", ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    upload(cld, {
      file: selectImage,
      options: options,
      callback: async (error, response) => {
        if (response) {
          const { data } = await axios.post(
            `${process.env.EXPO_PUBLIC_HOST_URL}/events`,
            {
              eventName: eventName,
              bannerUrl: response.url,
              location,
              link,
              eventDate: selectedDate,
              eventTime: selectedTime,
              email: user?.email,
            }
          );
          setLoading(false);
          Alert.alert("Greate!", "New Event Added", [
            {
              text: "Ok",
              onPress: () => {
                router.replace("/Event");
              },
            },
          ]);
        } else {
          console.log(error);
          setLoading(false);
        }
      },
    });
  };
  return (
    <View
      style={{
        padding: 20,
        backgroundColor: "#ffff",
        height: "100%",
      }}
    >
      <Text
        style={{
          fontSize: 25,
          fontWeight: "bold",
        }}
      >
        Add Event
      </Text>
      <TouchableOpacity onPress={pickImage}>
        {!selectImage ? (
          <Image
            source={require("../../assets/images/image.png")}
            style={{
              width: 100,
              height: 100,
              borderRadius: 15,
              marginTop: 10,
              borderWidth: 0.4,
            }}
          />
        ) : (
          <Image
            source={{ uri: selectImage }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 15,
              marginTop: 10,
              borderWidth: 0.4,
            }}
          />
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

      <InputField
        label="Event Name"
        Onchange={(v) => {
          setEventName(v);
        }}
        placeholder="Enter event name..."
        value={eventName}
      />
      <InputField
        label="Location"
        Onchange={(v) => {
          setLocation(v);
        }}
        placeholder="Enter event name..."
        value={location}
      />
      <InputField
        label="Description and Link"
        Onchange={(v) => {
          setLink(v);
        }}
        placeholder="Enter event name..."
        value={link}
      />
      <Button
        text={date}
        onClick={() => setOpenDatePicker(!openDatePicker)}
        outLine={true}
      />
      <Button
        text={time}
        onClick={() => setOpenTimePicker(!openTimePicker)}
        outLine={true}
      />
      {openTimePicker && (
        <RNDateTimePicker
          mode="time"
          value={new Date()}
          onChange={onChangeTime}
        />
      )}
      {openDatePicker && (
        <RNDateTimePicker
          mode="date"
          value={new Date()}
          onChange={onChangeDate}
        />
      )}

      <Button
        text={"Submit"}
        loading={loading}
        onClick={() => OnSubmitPress()}
      />
    </View>
  );
}
