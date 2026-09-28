import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Menu = {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
  available?: boolean;
  isActive?: boolean;
};

type Props = {
  menus: Menu[];
  formatRupiah: (value: number) => string;
  onAddToCart: (menu: Menu) => void;
};

export default function POSMenuList({
  menus,
  formatRupiah,
  onAddToCart,
}: Props) {
  return (
    <View className="mt-5">
      {/* Header */}
      <View className="mb-3 flex-row items-center justify-between px-4">
        <View>
          <Text className="text-lg font-bold text-white">Daftar Menu</Text>

          <Text className="mt-1 text-xs text-white/50">
            Pilih menu untuk membuat pesanan
          </Text>
        </View>

        <View className="rounded-lg bg-[#102A4A] px-3 py-2">
          <Text className="text-xs font-semibold text-[#4DB5FF]">
            {menus.length} Menu
          </Text>
        </View>
      </View>

      {/* Menu */}
      {menus.length === 0 ? (
        <View className="mx-4 items-center justify-center rounded-2xl border border-white/10 bg-[#0D223F] py-10">
          <Ionicons name="restaurant-outline" size={36} color="#6B82A8" />

          <Text className="mt-3 text-sm font-semibold text-white">
            Menu tidak ditemukan
          </Text>

          <Text className="mt-1 text-xs text-white/40">
            Coba gunakan kata pencarian lain
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
        >
          {menus.map((menu) => {
            const isAvailable =
              menu.isAvailable ?? menu.available ?? menu.isActive ?? true;

            return (
              <View
                key={menu.id}
                className="mr-3 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#0D223F]"
              >
                {/* Image */}
                <View className="h-32 w-full bg-[#172A49]">
                  {menu.imageUrl ? (
                    <Image
                      source={{
                        uri: menu.imageUrl,
                      }}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="h-full w-full items-center justify-center">
                      <Ionicons
                        name="restaurant-outline"
                        size={34}
                        color="#6B82A8"
                      />

                      <Text className="mt-2 text-xs text-white/30">
                        Tidak ada gambar
                      </Text>
                    </View>
                  )}

                  {/* Availability */}
                  {!isAvailable && (
                    <View className="absolute inset-0 items-center justify-center bg-black/60">
                      <View className="rounded-lg bg-black/70 px-3 py-2">
                        <Text className="text-xs font-bold text-red-400">
                          Tidak Tersedia
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Information */}
                <View className="p-3">
                  <Text
                    numberOfLines={1}
                    className="text-sm font-bold text-white"
                  >
                    {menu.name}
                  </Text>

                  <Text
                    numberOfLines={1}
                    className="mt-1 text-[11px] text-white/40"
                  >
                    {menu.category}
                  </Text>

                  <View className="mt-3 flex-row items-center justify-between">
                    <Text className="text-sm font-bold text-[#4DB5FF]">
                      {formatRupiah(menu.price)}
                    </Text>

                    <Pressable
                      disabled={!isAvailable}
                      onPress={() => onAddToCart(menu)}
                      className={`h-9 w-9 items-center justify-center rounded-xl ${
                        isAvailable ? "bg-[#2563EB]" : "bg-[#172A49]"
                      }`}
                    >
                      <Ionicons
                        name="add"
                        size={20}
                        color={isAvailable ? "#FFFFFF" : "#526887"}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
