import React from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type User = {
  id: string;
  name: string;
  email: string;
};

type Props = {
  visible: boolean;
  user: User;
  onClose: () => void;
  onLogout: () => void;
};

export default function ProfileModal({
  visible,
  user,
  onClose,
  onLogout,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60">
        <Pressable className="flex-1" onPress={onClose} />

        <View className="rounded-t-[30px] border-t border-[#1E293B] bg-[#0B1220] px-6 pb-8 pt-5">
          {/* HEADER */}

          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-white">Profil</Text>

            <Pressable
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-[#172033] active:bg-[#202C42]"
            >
              <Ionicons name="close" size={22} color="#CBD5E1" />
            </Pressable>
          </View>

          {/* AVATAR */}

          <View className="mb-6 items-center">
            <View
              className="h-[82px] w-[82px] items-center justify-center rounded-full"
              style={{
                backgroundColor: "rgba(37, 99, 235, 0.75)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.15)",
              }}
            >
              <Ionicons name="person" size={40} color="#FFFFFF" />
            </View>

            <Text className="mt-3 text-xl font-bold text-white">
              {user.name}
            </Text>

            <Text className="mt-1 text-sm text-[#94A3B8]">{user.email}</Text>
          </View>

          {/* DATA USER */}

          <View className="rounded-2xl border border-[#1E293B] bg-[#101826]">
            {/* NAMA */}

            <View className="flex-row items-center border-b border-[#1E293B] px-4 py-4">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#172554]">
                <Ionicons name="person-outline" size={20} color="#60A5FA" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-xs text-[#64748B]">Nama</Text>

                <Text className="mt-1 text-sm font-semibold text-white">
                  {user.name}
                </Text>
              </View>
            </View>

            {/* EMAIL */}

            <View className="flex-row items-center border-b border-[#1E293B] px-4 py-4">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#172554]">
                <Ionicons name="mail-outline" size={20} color="#60A5FA" />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-xs text-[#64748B]">Email</Text>

                <Text className="mt-1 text-sm font-semibold text-white">
                  {user.email}
                </Text>
              </View>
            </View>

            {/* ID */}

            <View className="flex-row items-center px-4 py-4">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-[#172554]">
                <Ionicons
                  name="finger-print-outline"
                  size={20}
                  color="#60A5FA"
                />
              </View>

              <View className="ml-3 flex-1">
                <Text className="text-xs text-[#64748B]">User ID</Text>

                <Text className="mt-1 text-sm font-semibold text-white">
                  {user.id}
                </Text>
              </View>
            </View>
          </View>

          {/* LOGOUT */}

          <Pressable
            onPress={onLogout}
            className="mt-6 flex-row items-center justify-center rounded-2xl border border-[#7F1D1D] bg-[#3F1115] py-4 active:bg-[#5A171D]"
          >
            <Ionicons name="log-out-outline" size={21} color="#F87171" />

            <Text className="ml-2 text-base font-bold text-[#F87171]">
              Logout
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
