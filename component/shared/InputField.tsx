import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TargetedEvent,
  KeyboardType,
} from "react-native";
import React from "react";

interface InputPropsType {
  placeholder: string;
  label: string;
  password?: boolean;
  Onchange: (text: string) => void;
  value: string | undefined;
  type?: KeyboardType;
}

export default function InputField({
  placeholder,
  label,
  password,
  Onchange,
  value,
  type,
}: InputPropsType) {
  return (
    <View>
      <Text
        style={{
          fontSize: 13,
          marginTop: 10,
        }}
      >
        {label}
      </Text>
      <TextInput
        placeholder={placeholder}
        secureTextEntry={password}
        style={styles.textField}
        onChangeText={Onchange}
        value={value}
        keyboardType={type}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textField: {
    borderWidth: 0.3,
    borderColor: "#000",
    padding: 10,
    fontSize: 16,
    marginTop: 5,
    borderRadius: 5,
  },
});
