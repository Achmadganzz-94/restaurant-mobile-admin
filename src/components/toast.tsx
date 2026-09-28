import React from "react";
import { Text, View } from "react-native";
import Toast, { BaseToastProps, ToastConfig } from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

type CustomToastProps = BaseToastProps & {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  borderColor: string;
};

const CustomToast = ({
  text1,
  text2,
  icon,
  iconColor,
  borderColor,
}: CustomToastProps) => {
  return (
    <View
      style={{
        width: "91%",
        minHeight: 82,
        backgroundColor: "#111827",
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#263244",
        borderLeftWidth: 5,
        borderLeftColor: borderColor,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: "row",
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
      }}
    >
      {/* ICON */}
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          backgroundColor: `${iconColor}18`,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 13,
        }}
      >
        <Ionicons name={icon} size={25} color={iconColor} />
      </View>

      {/* TEXT */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "#F8FAFC",
            fontSize: 17,
            fontWeight: "800",
            lineHeight: 22,
          }}
          numberOfLines={1}
        >
          {text1}
        </Text>

        {text2 ? (
          <Text
            style={{
              color: "#CBD5E1",
              fontSize: 14,
              fontWeight: "500",
              lineHeight: 19,
              marginTop: 3,
            }}
            numberOfLines={3}
          >
            {text2}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

export const toastConfig: ToastConfig = {
  success: (props) => (
    <CustomToast
      {...props}
      icon="checkmark-circle"
      iconColor="#22C55E"
      borderColor="#22C55E"
    />
  ),

  error: (props) => (
    <CustomToast
      {...props}
      icon="close-circle"
      iconColor="#EF4444"
      borderColor="#EF4444"
    />
  ),

  warning: (props) => (
    <CustomToast
      {...props}
      icon="warning"
      iconColor="#F59E0B"
      borderColor="#F59E0B"
    />
  ),

  info: (props) => (
    <CustomToast
      {...props}
      icon="information-circle"
      iconColor="#38BDF8"
      borderColor="#38BDF8"
    />
  ),
};

// Helper untuk menampilkan toast dari file lain
export const showToast = (
  type: "success" | "error" | "warning" | "info",
  text1: string,
  text2?: string,
) => {
  Toast.show({
    type,
    text1,
    text2,
    position: "top",
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 60,
  });
};

export default function AppToast() {
  return <Toast config={toastConfig} />;
}
