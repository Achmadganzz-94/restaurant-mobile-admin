import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MemberScreens() {
  return (
    <SafeAreaView className="flex-1 bg-[#071A33]">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold text-white">Member</Text>
      </View>
    </SafeAreaView>
  );
}
