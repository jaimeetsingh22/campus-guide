import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";
import Color from "@/assets/Color";

interface ButtonProps {
  text: String;
  onClick: () => void;
  loading?: boolean;
  outLine?: boolean;
  style?: any;
}

export default function Button({
  text,
  onClick,
  loading = false,
  outLine = false,
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity onPress={onClick}>
      <View
        style={[
          {
            backgroundColor: outLine ? "white" : Color.primary,
            padding: 20,
            paddingHorizontal: 30,
            borderRadius: 10,
            marginTop: 15,
            width: "100%",
            alignSelf: "center",
            borderWidth: outLine ? 1 : 0,
            marginBottom: 10,
          },
          { ...style },
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size={"large"}
            color={outLine ? "black" : "white"}
          />
        ) : (
          <Text
            style={{
              textAlign: "center",
              color: outLine ? Color.primary : Color.white,
            }}
          >
            {text}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
