import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  popularMenus: any[];
};

export default function TopSellingMenu({ popularMenus }: Props) {
  return (
    <View className="mt-6 px-5">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-xl font-bold text-white">Menu Terlaris</Text>

          <Text className="mt-1 text-xs text-white/55">
            Menu dengan penjualan tertinggi
          </Text>
        </View>

        <Pressable onPress={() => console.log("Lihat menu terlaris")}>
          <Text className="text-sm font-semibold text-[#3697FF]">
            Minggu ini
          </Text>
        </Pressable>
      </View>

      {/* Menu List */}
      <View
        className="rounded-2xl border border-white/10 p-4"
        style={{
          backgroundColor: "rgba(7, 25, 50, 0.72)",
        }}
      >
        {popularMenus.length === 0 ? (
          <Text className="py-4 text-center text-sm text-white/50">
            Belum ada data menu terlaris
          </Text>
        ) : (
          popularMenus.slice(0, 5).map((menu, index) => (
            <View
              key={menu.id ?? index}
              className={`flex-row items-center ${
                index !== Math.min(popularMenus.length, 5) - 1 ? "mb-4" : ""
              }`}
            >
              {/* Rank */}
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Text className="text-xs font-bold text-white/70">
                  #{index + 1}
                </Text>
              </View>

              {/* Menu Info */}
              <View className="ml-3 flex-1">
                <Text
                  numberOfLines={1}
                  className="text-sm font-semibold text-white"
                >
                  {menu.name ?? "-"}
                </Text>

                <Text className="mt-0.5 text-[10px] text-white/45">
                  {menu.category ?? "-"}
                </Text>
              </View>

              {/* Sold */}
              <View className="items-end">
                <Text className="text-sm font-bold text-white">
                  {menu.sold ?? 0}
                </Text>

                <Text className="text-[10px] text-white/45">terjual</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
