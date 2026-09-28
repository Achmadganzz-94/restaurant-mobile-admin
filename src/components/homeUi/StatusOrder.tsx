import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  orders: any[];
};

const orderStatus = [
  {
    label: "Pending",
    status: "PENDING",
    color: "#FBBF24",
    icon: "time-outline" as const,
  },
  {
    label: "Preparing",
    status: "PREPARING",
    color: "#3B82F6",
    icon: "flame-outline" as const,
  },
  {
    label: "Ready",
    status: "READY",
    color: "#8B5CF6",
    icon: "checkmark-circle-outline" as const,
  },
  {
    label: "Served",
    status: "SERVED",
    color: "#22C1DC",
    icon: "restaurant-outline" as const,
  },
  {
    label: "Completed",
    status: "COMPLETED",
    color: "#22C55E",
    icon: "checkmark-done-circle-outline" as const,
  },
];

export default function OrderStatus({ orders }: Props) {
  // =========================
  // FILTER ORDER HARI INI
  // =========================

  const today = new Date();

  const ordersToday = orders.filter((order) => {
    if (!order.createdAt) return false;

    const orderDate = new Date(order.createdAt);

    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear() &&
      order.status !== "CANCELLED"
    );
  });

  // =========================
  // HITUNG MASING-MASING STATUS
  // =========================

  const statusWithCount = orderStatus.map((status) => {
    const count = ordersToday.filter(
      (order) => order.status === status.status,
    ).length;

    return {
      ...status,
      count,
    };
  });

  return (
    <View className="mt-6 px-5">
      {/* Header */}
      <View className="mb-4">
        <Text className="text-xl font-bold text-white">Status Pesanan</Text>

        <Text className="mt-1 text-xs text-white/55">
          Kondisi pesanan hari ini
        </Text>
      </View>

      {/* Status Card */}
      <View
        className="rounded-2xl border border-white/10 p-5"
        style={{
          backgroundColor: "rgba(7, 25, 50, 0.72)",
        }}
      >
        {statusWithCount.map((status, index) => (
          <View
            key={status.label}
            className={`${index !== statusWithCount.length - 1 ? "mb-5" : ""}`}
          >
            {/* Label + Count */}
            <View className="mb-2 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View
                  className="mr-2 h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: status.color,
                  }}
                />

                <Ionicons name={status.icon} size={16} color={status.color} />

                <Text className="ml-2 text-sm font-medium text-white/80">
                  {status.label}
                </Text>
              </View>

              <Text className="text-sm font-bold text-white">
                {status.count}
              </Text>
            </View>

            {/* Progress Background */}
            <View className="h-2 overflow-hidden rounded-full bg-white/10">
              <View
                className="h-full rounded-full"
                style={{
                  width:
                    status.count > 0
                      ? `${Math.min(status.count * 10, 100)}%`
                      : "0%",
                  backgroundColor: status.color,
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
