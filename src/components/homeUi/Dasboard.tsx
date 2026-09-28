import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  orders: any[];
  menus: any[];
};

export default function DashboardStats({ orders, menus }: Props) {
  // =========================
  // PENJUALAN HARI INI
  // =========================
  const today = new Date();

  const isToday = (date: string | Date) => {
    const orderDate = new Date(date);

    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  };

  const todayOrders = orders.filter((order) => {
    return order.createdAt && isToday(order.createdAt);
  });

  // Pesanan yang bukan CANCELLED
  const validTodayOrders = todayOrders.filter(
    (order) => order.status !== "CANCELLED",
  );

  // Penjualan hanya dari order PAID dan bukan CANCELLED
  const salesToday = validTodayOrders
    .filter((order) => order.paymentStatus === "PAID")
    .reduce((total, order) => {
      return total + Number(order.totalPrice || 0);
    }, 0);

  // =========================
  // PESANAN HARI INI
  // =========================
  const ordersToday = validTodayOrders.length;

  // =========================
  // SEDANG DIPROSES
  // =========================
  const preparingOrders = orders.filter(
    (order) => order.status === "PREPARING",
  ).length;

  // =========================
  // MENU TERSEDIA
  // =========================
  const availableMenus = menus.filter((menu) => {
    if (typeof menu.isAvailable === "boolean") {
      return menu.isAvailable;
    }

    if (typeof menu.available === "boolean") {
      return menu.available;
    }

    if (typeof menu.isActive === "boolean") {
      return menu.isActive;
    }

    // Kalau API tidak punya field status ketersediaan,
    // anggap menu yang dikembalikan API sebagai tersedia.
    return true;
  }).length;

  // =========================
  // FORMAT RUPIAH
  // =========================
  const formatRupiah = (value: number) => {
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  return (
    <View className="mt-2 px-5">
      {/* Section Title */}
      <Text className="mb-4 text-xl font-bold text-white">Dashboard</Text>

      {/* Stats Grid */}
      <View className="flex-row flex-wrap justify-between">
        {/* Penjualan Hari Ini */}
        <View
          className="mb-4 w-[48%] rounded-2xl border border-white/15 p-4"
          style={{
            backgroundColor: "rgba(7, 25, 50, 0.72)",
          }}
        >
          <View className="mb-4 h-10 w-10 items-center justify-center rounded-xl bg-[#FF8A00]/15">
            <Ionicons name="cash-outline" size={21} color="#FF8A00" />
          </View>

          <Text className="text-xs text-white/60">Penjualan Hari Ini</Text>

          <Text className="mt-1 text-lg font-bold text-white">
            {formatRupiah(salesToday)}
          </Text>
        </View>

        {/* Pesanan Hari Ini */}
        <View
          className="mb-4 w-[48%] rounded-2xl border border-white/15 p-4"
          style={{
            backgroundColor: "rgba(7, 25, 50, 0.72)",
          }}
        >
          <View className="mb-4 h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15">
            <Ionicons name="receipt-outline" size={21} color="#60A5FA" />
          </View>

          <Text className="text-xs text-white/60">Pesanan Hari Ini</Text>

          <Text className="mt-1 text-lg font-bold text-white">
            {ordersToday}
          </Text>
        </View>

        {/* Sedang Diproses */}
        <View
          className="mb-4 w-[48%] rounded-2xl border border-white/15 p-4"
          style={{
            backgroundColor: "rgba(7, 25, 50, 0.72)",
          }}
        >
          <View className="mb-4 h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/15">
            <Ionicons name="time-outline" size={21} color="#FACC15" />
          </View>

          <Text className="text-xs text-white/60">Sedang Diproses</Text>

          <Text className="mt-1 text-lg font-bold text-white">
            {preparingOrders}
          </Text>
        </View>

        {/* Menu Tersedia */}
        <View
          className="mb-4 w-[48%] rounded-2xl border border-white/15 p-4"
          style={{
            backgroundColor: "rgba(7, 25, 50, 0.72)",
          }}
        >
          <View className="mb-4 h-10 w-10 items-center justify-center rounded-xl bg-green-500/15">
            <Ionicons name="restaurant-outline" size={21} color="#4ADE80" />
          </View>

          <Text className="text-xs text-white/60">Menu Tersedia</Text>

          <Text className="mt-1 text-lg font-bold text-white">
            {availableMenus}
          </Text>
        </View>
      </View>
    </View>
  );
}
