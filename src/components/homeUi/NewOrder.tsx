import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  orders: any[];
};

function getStatusStyle(status: string) {
  switch (status) {
    case "COMPLETED":
      return {
        background: "rgba(16, 185, 129, 0.15)",
        text: "#34D399",
      };

    case "PENDING":
      return {
        background: "rgba(251, 191, 36, 0.15)",
        text: "#FBBF24",
      };

    case "PREPARING":
      return {
        background: "rgba(59, 130, 246, 0.15)",
        text: "#60A5FA",
      };

    case "READY":
      return {
        background: "rgba(139, 92, 246, 0.15)",
        text: "#A78BFA",
      };

    case "SERVED":
      return {
        background: "rgba(34, 193, 220, 0.15)",
        text: "#22C1DC",
      };

    default:
      return {
        background: "rgba(255, 255, 255, 0.08)",
        text: "#FFFFFF",
      };
  }
}

function getPaymentStyle(payment: string) {
  if (payment === "PAID") {
    return {
      background: "rgba(16, 185, 129, 0.15)",
      text: "#34D399",
    };
  }

  return {
    background: "rgba(244, 63, 94, 0.15)",
    text: "#FB7185",
  };
}

export default function RecentOrders({ orders }: Props) {
  // Ambil 5 pesanan terbaru
  const recentOrders = orders.slice(0, 5);

  return (
    <View className="mt-6 px-5">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-xl font-bold text-white">Pesanan Terbaru</Text>

          <Text className="mt-1 text-xs text-white/55">
            Transaksi yang baru masuk
          </Text>
        </View>

        <Pressable
          onPress={() => console.log("Lihat semua pesanan")}
          className="flex-row items-center"
        >
          <Text className="text-sm font-semibold text-[#3697FF]">
            Lihat Semua
          </Text>

          <Ionicons
            name="arrow-forward"
            size={15}
            color="#3697FF"
            style={{ marginLeft: 4 }}
          />
        </Pressable>
      </View>

      {/* Orders */}
      <View
        className="rounded-2xl border border-white/10 p-4"
        style={{
          backgroundColor: "rgba(7, 25, 50, 0.72)",
        }}
      >
        {recentOrders.length === 0 ? (
          <Text className="py-5 text-center text-sm text-white/50">
            Belum ada pesanan
          </Text>
        ) : (
          recentOrders.map((item, index) => {
            const statusStyle = getStatusStyle(item.status);
            const paymentStyle = getPaymentStyle(item.paymentStatus);

            return (
              <View
                key={item.id ?? item.orderNumber ?? index}
                className={`${
                  index !== recentOrders.length - 1
                    ? "mb-4 border-b border-white/10 pb-4"
                    : ""
                }`}
              >
                {/* Order Header */}
                <View className="flex-row items-start justify-between">
                  <View className="flex-1 pr-3">
                    <Text
                      className="text-sm font-bold text-white"
                      numberOfLines={1}
                    >
                      {item.orderNumber ?? "-"}
                    </Text>

                    <Text className="mt-1 text-xs text-white/45">
                      {item.tableNumber ? `Meja ${item.tableNumber}` : "-"}
                    </Text>
                  </View>

                  <Text className="text-sm font-bold text-white">
                    Rp {Number(item.totalPrice || 0).toLocaleString("id-ID")}
                  </Text>
                </View>

                {/* Customer + Type */}
                <View className="mt-3 flex-row items-center">
                  <Ionicons name="person-outline" size={14} color="#94A3B8" />

                  <Text
                    className="ml-1 flex-1 text-xs text-white/65"
                    numberOfLines={1}
                  >
                    {item.customer?.name ??
                      item.customerName ??
                      "Walk-in Customer"}
                  </Text>

                  <View className="rounded-md bg-white/5 px-2 py-1">
                    <Text className="text-[9px] font-semibold text-white/55">
                      {item.orderType ?? "-"}
                    </Text>
                  </View>
                </View>

                {/* Status + Payment */}
                <View className="mt-3 flex-row items-center justify-between">
                  <View
                    className="rounded-full px-3 py-1"
                    style={{
                      backgroundColor: statusStyle.background,
                    }}
                  >
                    <Text
                      className="text-[10px] font-bold"
                      style={{
                        color: statusStyle.text,
                      }}
                    >
                      {item.status ?? "-"}
                    </Text>
                  </View>

                  <View
                    className="rounded-full px-3 py-1"
                    style={{
                      backgroundColor: paymentStyle.background,
                    }}
                  >
                    <Text
                      className="text-[10px] font-bold"
                      style={{
                        color: paymentStyle.text,
                      }}
                    >
                      {item.paymentStatus ?? "-"}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}
