import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type OrderType = "DINE_IN" | "TAKEAWAY" | "DELIVERY";
const DINE_IN = "DINE_IN";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type Props = {
  visible: boolean;
  items: CartItem[];
  formatRupiah: (value: number) => string;
  onClose: () => void;
  onSubmit: (data: {
    orderType: OrderType;
    tableNumber?: number;
    customerId?: string;
  }) => void;
};

export default function CheckoutPos({
  visible,
  items,
  formatRupiah,
  onClose,
  onSubmit,
}: Props) {
  const [orderType, setOrderType] = useState<OrderType>("DINE_IN");

  const [tableNumber, setTableNumber] = useState("");

  const [customerId, setCustomerId] = useState("");

  const [error, setError] = useState("");

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const handleSubmit = () => {
    setError("");

    if (items.length === 0) {
      setError("Keranjang masih kosong.");
      return;
    }

    if (orderType === "DINE_IN" && !tableNumber.trim()) {
      setError("Nomor meja wajib diisi.");
      return;
    }

    let parsedTableNumber: number | undefined;

    if (orderType === "DINE_IN") {
      parsedTableNumber = Number(tableNumber);

      if (!Number.isInteger(parsedTableNumber) || parsedTableNumber <= 0) {
        setError("Nomor meja tidak valid.");
        return;
      }
    }

    onSubmit({
      orderType,

      ...(parsedTableNumber !== undefined && {
        tableNumber: parsedTableNumber,
      }),

      ...(customerId.trim() && {
        customerId: customerId.trim(),
      }),
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/60">
        <View className="max-h-[90%] rounded-t-[28px] bg-[#071A33]">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-white/10 px-5 py-4">
            <View>
              <Text className="text-xl font-bold text-white">Checkout</Text>

              <Text className="mt-1 text-xs text-white/50">
                Lengkapi detail pesanan
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-[#102A4A]"
            >
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              padding: 20,
              paddingBottom: 30,
            }}
          >
            {/* Tipe Pesanan */}
            <Text className="mb-3 text-sm font-bold text-white">
              Tipe Pesanan
            </Text>

            <View className="flex-row">
              {/* Dine In */}
              <Pressable
                onPress={() => {
                  setOrderType("DINE_IN");
                  setError("");
                }}
                className={`mr-2 flex-1 items-center rounded-2xl border p-3 ${
                  orderType === "DINE_IN"
                    ? "border-[#2563EB] bg-[#102A4A]"
                    : "border-white/10 bg-[#0D223F]"
                }`}
              >
                <Ionicons
                  name="restaurant-outline"
                  size={24}
                  color={orderType === "DINE_IN" ? "#4DB5FF" : "#9DB2D8"}
                />

                <Text className="mt-2 text-xs font-bold text-white">
                  Dine In
                </Text>
              </Pressable>

              {/* Takeaway */}
              <Pressable
                onPress={() => {
                  setOrderType("TAKEAWAY");
                  setTableNumber("");
                  setError("");
                }}
                className={`mr-2 flex-1 items-center rounded-2xl border p-3 ${
                  orderType === "TAKEAWAY"
                    ? "border-[#2563EB] bg-[#102A4A]"
                    : "border-white/10 bg-[#0D223F]"
                }`}
              >
                <Ionicons
                  name="bag-handle-outline"
                  size={24}
                  color={orderType === "TAKEAWAY" ? "#4DB5FF" : "#9DB2D8"}
                />

                <Text className="mt-2 text-xs font-bold text-white">
                  Takeaway
                </Text>
              </Pressable>

              {/* Delivery */}
              <Pressable
                onPress={() => {
                  setOrderType("DELIVERY");
                  setTableNumber("");
                  setError("");
                }}
                className={`flex-1 items-center rounded-2xl border p-3 ${
                  orderType === "DELIVERY"
                    ? "border-[#2563EB] bg-[#102A4A]"
                    : "border-white/10 bg-[#0D223F]"
                }`}
              >
                <Ionicons
                  name="car-outline"
                  size={24}
                  color={orderType === "DELIVERY" ? "#4DB5FF" : "#9DB2D8"}
                />

                <Text className="mt-2 text-xs font-bold text-white">
                  Delivery
                </Text>
              </Pressable>
            </View>

            {/* Nomor Meja */}
            {orderType === DINE_IN && (
              <View className="mt-5">
                <Text className="mb-2 text-sm font-bold text-white">
                  Nomor Meja
                </Text>

                <View className="flex-row items-center rounded-xl border border-white/10 bg-[#0D223F] px-3">
                  <Ionicons name="grid-outline" size={20} color="#6B82A8" />

                  <TextInput
                    value={tableNumber}
                    onChangeText={(value) => {
                      setTableNumber(value.replace(/[^0-9]/g, ""));
                      setError("");
                    }}
                    keyboardType="number-pad"
                    placeholder="Masukkan nomor meja"
                    placeholderTextColor="#526887"
                    className="ml-3 flex-1 py-3 text-sm text-white"
                  />
                </View>
              </View>
            )}

            {/* Customer */}
            <View className="mt-5">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-sm font-bold text-white">Customer</Text>

                <Text className="text-[11px] text-white/30">Opsional</Text>
              </View>

              <View className="flex-row items-center rounded-xl border border-white/10 bg-[#0D223F] px-3">
                <Ionicons name="person-outline" size={20} color="#6B82A8" />

                <TextInput
                  value={customerId}
                  onChangeText={(value) => {
                    setCustomerId(value);
                    setError("");
                  }}
                  placeholder="Masukkan Customer ID"
                  placeholderTextColor="#526887"
                  autoCapitalize="none"
                  className="ml-3 flex-1 py-3 text-sm text-white"
                />
              </View>
            </View>

            {/* Ringkasan */}
            <View className="mt-5 rounded-2xl border border-white/10 bg-[#0D223F] p-4">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-sm font-bold text-white">Ringkasan</Text>

                <Text className="text-xs text-white/40">{totalItems} item</Text>
              </View>

              {items.map((item) => (
                <View
                  key={item.id}
                  className="mb-2 flex-row items-center justify-between"
                >
                  <Text
                    numberOfLines={1}
                    className="mr-3 flex-1 text-xs text-white/60"
                  >
                    {item.name} × {item.quantity}
                  </Text>

                  <Text className="text-xs font-semibold text-white">
                    {formatRupiah(item.price * item.quantity)}
                  </Text>
                </View>
              ))}

              <View className="mt-3 border-t border-white/10 pt-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-bold text-white">Total</Text>

                  <Text className="text-lg font-bold text-[#4DB5FF]">
                    {formatRupiah(totalPrice)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Error */}
            {error ? (
              <View className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                <Text className="text-xs text-red-400">{error}</Text>
              </View>
            ) : null}

            {/* Buat Pesanan */}
            <Pressable
              onPress={handleSubmit}
              className="mt-5 h-12 flex-row items-center justify-center rounded-xl bg-[#2563EB]"
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={21}
                color="#FFFFFF"
              />

              <Text className="ml-2 text-sm font-bold text-white">
                Buat Pesanan
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
