import React from "react";
import { Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

type Props = {
  visible: boolean;
  items: CartItem[];
  formatRupiah: (value: number) => string;
  onClose: () => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
};

export default function CartPos({
  visible,
  items,
  formatRupiah,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
}: Props) {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/60">
        <View className="max-h-[85%] rounded-t-[28px] border-t border-white/10 bg-[#071A33]">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-white/10 px-5 py-4">
            <View>
              <Text className="text-xl font-bold text-white">
                Keranjang Pesanan
              </Text>

              <Text className="mt-1 text-xs text-white/50">
                {totalItems} item
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-[#102A4A]"
            >
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Cart */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 20,
            }}
          >
            {items.length === 0 ? (
              <View className="items-center justify-center py-16">
                <View className="h-16 w-16 items-center justify-center rounded-full bg-[#102A4A]">
                  <Ionicons name="cart-outline" size={30} color="#6B82A8" />
                </View>

                <Text className="mt-4 text-base font-bold text-white">
                  Keranjang kosong
                </Text>

                <Text className="mt-1 text-center text-xs text-white/40">
                  Tambahkan menu terlebih dahulu
                </Text>
              </View>
            ) : (
              items.map((item) => (
                <View
                  key={item.id}
                  className="mb-3 rounded-2xl border border-white/10 bg-[#0D223F] p-3"
                >
                  <View className="flex-row">
                    {/* Image */}
                    <View className="mr-3 h-20 w-20 overflow-hidden rounded-xl bg-[#172A49]">
                      {item.imageUrl ? (
                        <Image
                          source={{
                            uri: item.imageUrl,
                          }}
                          className="h-full w-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="h-full w-full items-center justify-center">
                          <Ionicons
                            name="restaurant-outline"
                            size={28}
                            color="#6B82A8"
                          />
                        </View>
                      )}
                    </View>

                    {/* Information */}
                    <View className="flex-1">
                      <View className="flex-row items-start">
                        <View className="flex-1 pr-2">
                          <Text
                            numberOfLines={1}
                            className="text-sm font-bold text-white"
                          >
                            {item.name}
                          </Text>

                          <Text className="mt-1 text-xs text-[#4DB5FF]">
                            {formatRupiah(item.price)}
                          </Text>
                        </View>

                        <Pressable
                          onPress={() => onRemove(item.id)}
                          className="h-8 w-8 items-center justify-center rounded-lg"
                        >
                          <Ionicons
                            name="trash-outline"
                            size={18}
                            color="#FF6B6B"
                          />
                        </Pressable>
                      </View>

                      {/* Quantity */}
                      <View className="mt-3 flex-row items-center justify-between">
                        <Text className="text-sm font-bold text-white">
                          {formatRupiah(item.price * item.quantity)}
                        </Text>

                        <View className="flex-row items-center rounded-xl bg-[#071A33] p-1">
                          <Pressable
                            onPress={() => onDecrease(item.id)}
                            className="h-8 w-8 items-center justify-center rounded-lg"
                          >
                            <Ionicons name="remove" size={17} color="#9DB2D8" />
                          </Pressable>

                          <Text className="w-8 text-center text-sm font-bold text-white">
                            {item.quantity}
                          </Text>

                          <Pressable
                            onPress={() => onIncrease(item.id)}
                            className="h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]"
                          >
                            <Ionicons name="add" size={17} color="#FFFFFF" />
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {/* Summary */}
          <View className="border-t border-white/10 bg-[#0D223F] px-5 pb-6 pt-4">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-sm text-white/50">Subtotal</Text>

              <Text className="text-sm font-semibold text-white">
                {formatRupiah(subtotal)}
              </Text>
            </View>

            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-base font-bold text-white">Total</Text>

              <Text className="text-xl font-bold text-[#4DB5FF]">
                {formatRupiah(subtotal)}
              </Text>
            </View>

            <Pressable
              onPress={onCheckout}
              disabled={items.length === 0}
              className={`h-12 flex-row items-center justify-center rounded-xl ${
                items.length === 0 ? "bg-[#1A3150]" : "bg-[#2563EB]"
              }`}
            >
              <Ionicons
                name="arrow-forward-circle-outline"
                size={21}
                color={items.length === 0 ? "#526887" : "#FFFFFF"}
              />

              <Text
                className={`ml-2 text-sm font-bold ${
                  items.length === 0 ? "text-white/30" : "text-white"
                }`}
              >
                Lanjut ke Checkout
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
