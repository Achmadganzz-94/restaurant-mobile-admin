import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  orders: any[];
};

const periods = ["7 Hari", "30 Hari", "90 Hari"];

export default function SalesOverview({ orders }: Props) {
  const [selectedPeriod, setSelectedPeriod] = useState("30 Hari");
  const [showPeriod, setShowPeriod] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const days =
    selectedPeriod === "7 Hari" ? 7 : selectedPeriod === "30 Hari" ? 30 : 90;

  // Data chart periode yang dipilih
  const salesData = useMemo(() => {
    const result: {
      label: string;
      value: number;
    }[] = [];

    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);

      date.setDate(today.getDate() - i);

      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const total = orders
        .filter((order) => {
          if (!order.createdAt) return false;

          const orderDate = new Date(order.createdAt);

          return (
            orderDate >= dayStart &&
            orderDate <= dayEnd &&
            order.status !== "CANCELLED" &&
            order.paymentStatus === "PAID"
          );
        })
        .reduce((sum, order) => {
          return sum + Number(order.totalPrice || 0);
        }, 0);

      result.push({
        label:
          selectedPeriod === "7 Hari"
            ? date.toLocaleDateString("id-ID", {
                weekday: "short",
              })
            : date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              }),
        value: total,
      });
    }

    return result;
  }, [orders, selectedPeriod, days]);

  // Total penjualan periode sekarang
  const totalSales = salesData.reduce((total, item) => total + item.value, 0);

  // Penjualan periode sebelumnya
  const previousSales = useMemo(() => {
    const today = new Date();

    const previousPeriodStart = new Date(today);

    previousPeriodStart.setDate(today.getDate() - days * 2 + 1);

    previousPeriodStart.setHours(0, 0, 0, 0);

    const previousPeriodEnd = new Date(today);

    previousPeriodEnd.setDate(today.getDate() - days);

    previousPeriodEnd.setHours(23, 59, 59, 999);

    return orders
      .filter((order) => {
        if (!order.createdAt) return false;

        const orderDate = new Date(order.createdAt);

        return (
          orderDate >= previousPeriodStart &&
          orderDate <= previousPeriodEnd &&
          order.status !== "CANCELLED" &&
          order.paymentStatus === "PAID"
        );
      })
      .reduce((sum, order) => {
        return sum + Number(order.totalPrice || 0);
      }, 0);
  }, [orders, days]);

  // Hitung persentase perubahan
  const salesPercentage = useMemo(() => {
    if (previousSales === 0) {
      return totalSales === 0 ? 0 : 100;
    }

    return ((totalSales - previousSales) / previousSales) * 100;
  }, [totalSales, previousSales]);

  const isUp = salesPercentage > 0;
  const isDown = salesPercentage < 0;

  const percentageText = `${Math.abs(salesPercentage).toFixed(1)}%`;

  const maxValue = Math.max(...salesData.map((item) => item.value), 1);

  const formatRupiah = (value: number) => {
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  // Set posisi chart ke data terbaru
  // setiap kali filter berubah
  useEffect(() => {
    if (selectedPeriod === "7 Hari") {
      scrollRef.current?.scrollTo({
        x: 0,
        y: 0,
        animated: false,
      });

      return;
    }

    const timer = setTimeout(() => {
      scrollRef.current?.scrollToEnd({
        animated: false,
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedPeriod, salesData]);

  return (
    <View className="mt-2 px-5">
      {/* Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-xl font-bold text-white">Penjualan</Text>

          <Text className="mt-1 text-xs text-white/55">
            Ringkasan penjualan {selectedPeriod.toLowerCase()}
          </Text>
        </View>

        {/* Filter */}
        <View className="relative">
          <Pressable
            onPress={() => setShowPeriod((prev) => !prev)}
            className="flex-row items-center rounded-xl border border-white/10 bg-[#10233D]/90 px-3 py-2"
          >
            <Text className="text-xs font-medium text-white">
              {selectedPeriod}
            </Text>

            <Ionicons
              name={showPeriod ? "chevron-up" : "chevron-down"}
              size={15}
              color="#CBD5E1"
              style={{ marginLeft: 6 }}
            />
          </Pressable>

          {showPeriod && (
            <View
              className="absolute right-0 top-11 z-50 w-28 overflow-hidden rounded-xl border border-white/10"
              style={{
                backgroundColor: "#10233D",
                elevation: 10,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              }}
            >
              {periods.map((period) => {
                const active = selectedPeriod === period;

                return (
                  <Pressable
                    key={period}
                    onPress={() => {
                      setSelectedPeriod(period);
                      setShowPeriod(false);
                    }}
                    className={`px-4 py-3 ${active ? "bg-[#2587FF]/20" : ""}`}
                  >
                    <Text
                      className={`text-xs ${
                        active ? "font-bold text-[#3697FF]" : "text-white/80"
                      }`}
                    >
                      {period}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
        </View>
      </View>

      {/* Chart */}
      <View
        className="rounded-2xl border border-white/10 p-5"
        style={{
          backgroundColor: "rgba(7, 25, 50, 0.72)",
        }}
      >
        <View className="h-[190px]">
          {/* Grid */}
          <View className="absolute left-0 right-0 top-0 border-t border-dashed border-white/10" />

          <View className="absolute left-0 right-0 top-[47px] border-t border-dashed border-white/10" />

          <View className="absolute left-0 right-0 top-[94px] border-t border-dashed border-white/10" />

          <View className="absolute left-0 right-0 top-[141px] border-t border-dashed border-white/10" />

          {/* Scroll Chart */}
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 8,
            }}
          >
            <View
              className="flex-row items-end"
              style={{
                gap: 10,

                width:
                  selectedPeriod === "7 Hari"
                    ? 7 * 32 + 6 * 10 + 16
                    : selectedPeriod === "30 Hari"
                      ? 30 * 32 + 29 * 10 + 16
                      : 90 * 32 + 89 * 10 + 16,
              }}
            >
              {salesData.map((item, index) => {
                const height =
                  item.value > 0
                    ? Math.max((item.value / maxValue) * 150, 4)
                    : 4;

                return (
                  <View
                    key={`${item.label}-${index}`}
                    className="items-center"
                    style={{
                      width: 32,
                    }}
                  >
                    <View
                      className="w-5 rounded-t-md bg-[#2587FF]"
                      style={{
                        height,
                        opacity: item.value > 0 ? 1 : 0.25,
                      }}
                    />

                    <Text className="mt-3 text-[10px] text-white/45">
                      {item.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Total */}
        <View className="mt-5 flex-row items-center justify-between border-t border-white/10 pt-4">
          <View>
            <Text className="text-xs text-white/45">Total Penjualan</Text>

            <Text className="mt-1 text-lg font-bold text-white">
              {formatRupiah(totalSales)}
            </Text>
          </View>

          {/* Percentage */}
          <View
            className={`flex-row items-center rounded-full px-3 py-1.5 ${
              isUp
                ? "bg-green-500/10"
                : isDown
                  ? "bg-red-500/10"
                  : "bg-white/10"
            }`}
          >
            <Ionicons
              name={isUp ? "trending-up" : isDown ? "trending-down" : "remove"}
              size={14}
              color={isUp ? "#4ADE80" : isDown ? "#F87171" : "#94A3B8"}
            />

            <Text
              className={`ml-1 text-xs font-semibold ${
                isUp
                  ? "text-green-400"
                  : isDown
                    ? "text-red-400"
                    : "text-slate-400"
              }`}
            >
              {isDown ? "-" : "+"}
              {percentageText}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
