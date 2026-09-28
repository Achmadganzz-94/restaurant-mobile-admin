import React from "react";
import { ScrollView, Text, View } from "react-native";

type Props = {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
};

export default function POSOrderStats({
  totalOrders,
  pendingOrders,
  processingOrders,
  completedOrders,
}: Props) {
  return (
    <View className="mt-6">
      {/* Header */}
      <View className="px-5">
        <Text className="text-xl font-bold text-white">Daftar Pesanan</Text>

        <Text className="mt-1 text-xs text-white/50">
          Klik pesanan untuk melihat detail lengkap
        </Text>
      </View>

      {/* Statistik */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 18,
        }}
      >
        {/* Total */}
        <View className="mr-3 w-[135px] rounded-2xl border border-white/10 bg-[#0D2544] p-4">
          <Text className="text-xs text-white/50">Total Pesanan</Text>

          <Text className="mt-2 text-2xl font-bold text-white">
            {totalOrders}
          </Text>
        </View>

        {/* Pending */}
        <View className="mr-3 w-[135px] rounded-2xl border border-white/10 bg-[#0D2544] p-4">
          <Text className="text-xs text-white/50">Pending</Text>

          <Text className="mt-2 text-2xl font-bold text-orange-400">
            {pendingOrders}
          </Text>
        </View>

        {/* Diproses */}
        <View className="mr-3 w-[135px] rounded-2xl border border-white/10 bg-[#0D2544] p-4">
          <Text className="text-xs text-white/50">Diproses</Text>

          <Text className="mt-2 text-2xl font-bold text-blue-400">
            {processingOrders}
          </Text>
        </View>

        {/* Selesai */}
        <View className="w-[135px] rounded-2xl border border-white/10 bg-[#0D2544] p-4">
          <Text className="text-xs text-white/50">Selesai</Text>

          <Text className="mt-2 text-2xl font-bold text-green-400">
            {completedOrders}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
