import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
};

type Props = {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
};

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
};

export default function MenuCard({ item, onEdit, onDelete }: Props) {
  return (
    <View className="mb-4 overflow-hidden rounded-2xl border border-[#1E293B] bg-[#101826]">
      {/* Gambar menu */}
      <View className="relative h-40 w-full bg-[#0B1220]">
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full items-center justify-center">
            <Ionicons name="restaurant-outline" size={42} color="#475569" />
            <Text className="mt-2 text-xs text-[#64748B]">
              Tidak ada gambar
            </Text>
          </View>
        )}

        {/* Status */}
        <View
          className={`absolute right-3 top-3 flex-row items-center rounded-full px-3 py-1.5 ${
            item.isAvailable ? "bg-[#052E1A]" : "bg-[#3F1115]"
          }`}
        >
          <View
            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
              item.isAvailable ? "bg-[#22C55E]" : "bg-[#EF4444]"
            }`}
          />

          <Text
            className={`text-[10px] font-semibold ${
              item.isAvailable ? "text-[#4ADE80]" : "text-[#F87171]"
            }`}
          >
            {item.isAvailable ? "TERSEDIA" : "HABIS"}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View className="p-4">
        {/* Category */}
        <View className="mb-2 self-start rounded-md bg-[#172554] px-2.5 py-1">
          <Text className="text-[10px] font-semibold uppercase text-[#60A5FA]">
            {item.category}
          </Text>
        </View>

        {/* Nama */}
        <Text numberOfLines={1} className="text-base font-bold text-white">
          {item.name}
        </Text>

        {/* Description */}
        <Text
          numberOfLines={2}
          className="mt-1.5 min-h-[32px] text-xs leading-4 text-[#94A3B8]"
        >
          {item.description || "Tidak ada deskripsi menu"}
        </Text>

        {/* Harga */}
        <Text className="mt-3 text-base font-bold text-[#60A5FA]">
          {formatRupiah(item.price)}
        </Text>

        {/* Action */}
        <View className="mt-4 flex-row gap-2">
          <Pressable
            onPress={() => onEdit(item)}
            className="flex-1 flex-row items-center justify-center rounded-xl border border-[#1D4ED8] bg-[#172554] py-2.5 active:bg-[#1E3A8A]"
          >
            <Ionicons name="create-outline" size={16} color="#60A5FA" />

            <Text className="ml-1.5 text-xs font-semibold text-[#60A5FA]">
              Edit
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onDelete(item.id)}
            className="flex-1 flex-row items-center justify-center rounded-xl border border-[#451A1A] bg-[#241114] py-2.5 active:bg-[#3F1115]"
          >
            <Ionicons name="trash-outline" size={16} color="#F87171" />

            <Text className="ml-1.5 text-xs font-semibold text-[#F87171]">
              Hapus
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
