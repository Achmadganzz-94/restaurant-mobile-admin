import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";

import { api } from "../../config/Api";
import { showToast } from "../toast";

import { MenuItem } from "./MenuCard";

type Props = {
  visible: boolean;
  editingMenu: MenuItem | null;
  onClose: () => void;
  onSaved: () => void;
};

const categories = ["MAKANAN", "MINUMAN", "SNACK", "DESSERT", "PAKET"];

export default function MenuForm({
  visible,
  editingMenu,
  onClose,
  onSaved,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("MAKANAN");
  const [imageUrl, setImageUrl] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;

    if (editingMenu) {
      setName(editingMenu.name);
      setDescription(editingMenu.description || "");
      setPrice(editingMenu.price.toString());
      setCategory(editingMenu.category);
      setImageUrl(editingMenu.imageUrl || "");
      setIsAvailable(editingMenu.isAvailable);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setCategory("MAKANAN");
      setImageUrl("");
      setIsAvailable(true);
    }
  }, [visible, editingMenu]);

  const handlePickImage = async () => {
    try {
      setImageLoading(true);

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showToast(
          "error",
          "Izin diperlukan",
          "Izinkan akses galeri untuk memilih gambar menu.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (result.canceled || !result.assets?.[0]) {
        return;
      }

      const asset = result.assets[0];

      if (!asset.base64) {
        showToast(
          "error",
          "Gagal mengambil gambar",
          "Data gambar tidak tersedia.",
        );
        return;
      }

      const mimeType = asset.mimeType || "image/jpeg";

      const base64Image = `data:${mimeType};base64,${asset.base64}`;

      setImageUrl(base64Image);
    } catch (error) {
      console.error("Pilih gambar:", error);

      showToast(
        "error",
        "Gagal memilih gambar",
        "Terjadi kesalahan saat mengambil gambar.",
      );
    } finally {
      setImageLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      showToast(
        "error",
        "Nama menu kosong",
        "Masukkan nama menu terlebih dahulu.",
      );
      return;
    }

    if (!price.trim()) {
      showToast(
        "error",
        "Harga kosong",
        "Masukkan harga menu terlebih dahulu.",
      );
      return;
    }

    const numericPrice = Number(price.replace(/[^0-9]/g, ""));

    if (!numericPrice || numericPrice <= 0) {
      showToast(
        "error",
        "Harga tidak valid",
        "Masukkan harga menu yang benar.",
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: numericPrice,
        category,
        imageUrl: imageUrl || "",
        isAvailable,
      };

      if (editingMenu) {
        await api.put(`/menu/${editingMenu.id}`, payload);

        showToast(
          "success",
          "Menu diperbarui",
          "Data menu berhasil diperbarui.",
        );
      } else {
        await api.post("/menu", payload);

        showToast(
          "success",
          "Menu ditambahkan",
          "Menu baru berhasil ditambahkan.",
        );
      }

      onSaved();
      onClose();
    } catch (error: any) {
      console.error("Simpan menu:", error);

      const message = error?.response?.data?.message || "Gagal menyimpan menu.";

      showToast("error", "Gagal menyimpan", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/70">
        <View className="max-h-[92%] rounded-t-[28px] border-t border-[#1E293B] bg-[#080D16]">
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-[#1E293B] px-5 py-4">
            <View>
              <Text className="text-xl font-bold text-white">
                {editingMenu ? "Edit Menu" : "Tambah Menu"}
              </Text>

              <Text className="mt-1 text-xs text-[#64748B]">
                {editingMenu
                  ? "Perbarui informasi menu"
                  : "Tambahkan menu baru"}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              disabled={loading}
              className="h-10 w-10 items-center justify-center rounded-full bg-[#111827] active:bg-[#1E293B]"
            >
              <Ionicons name="close" size={22} color="#94A3B8" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              padding: 20,
              paddingBottom: 35,
            }}
          >
            {/* Nama */}
            <Text className="mb-2 text-sm font-semibold text-[#CBD5E1]">
              Nama Menu
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Contoh: Nasi Goreng Spesial"
              placeholderTextColor="#64748B"
              className="mb-5 rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3.5 text-sm text-white"
            />

            {/* Harga */}
            <Text className="mb-2 text-sm font-semibold text-[#CBD5E1]">
              Harga
            </Text>

            <View className="mb-5 flex-row items-center rounded-xl border border-[#1E293B] bg-[#111827]">
              <Text className="pl-4 text-sm font-semibold text-[#64748B]">
                Rp
              </Text>

              <TextInput
                value={price}
                onChangeText={(value) => setPrice(value.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
                placeholder="25000"
                placeholderTextColor="#64748B"
                className="flex-1 px-3 py-3.5 text-sm text-white"
              />
            </View>

            {/* Category */}
            <Text className="mb-2 text-sm font-semibold text-[#CBD5E1]">
              Kategori
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-5"
            >
              {categories.map((item) => {
                const active = category === item;

                return (
                  <Pressable
                    key={item}
                    onPress={() => setCategory(item)}
                    className={`mr-2 rounded-xl border px-4 py-2.5 ${
                      active
                        ? "border-[#2563EB] bg-[#172554]"
                        : "border-[#1E293B] bg-[#111827]"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        active ? "text-[#60A5FA]" : "text-[#94A3B8]"
                      }`}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Image */}
            <Text className="mb-2 text-sm font-semibold text-[#CBD5E1]">
              Foto Menu
            </Text>

            {imageUrl ? (
              <View className="mb-5 overflow-hidden rounded-2xl border border-[#1E293B] bg-[#111827]">
                <Image
                  source={{ uri: imageUrl }}
                  className="h-48 w-full"
                  resizeMode="cover"
                />

                <Pressable
                  onPress={handleRemoveImage}
                  className="absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-full bg-black/70"
                >
                  <Ionicons name="trash-outline" size={17} color="#F87171" />
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={handlePickImage}
                disabled={imageLoading}
                className="mb-5 h-36 items-center justify-center rounded-2xl border border-dashed border-[#334155] bg-[#111827] active:bg-[#172033]"
              >
                {imageLoading ? (
                  <ActivityIndicator size="small" color="#60A5FA" />
                ) : (
                  <>
                    <View className="mb-2 h-11 w-11 items-center justify-center rounded-full bg-[#172554]">
                      <Ionicons
                        name="camera-outline"
                        size={22}
                        color="#60A5FA"
                      />
                    </View>

                    <Text className="text-sm font-semibold text-[#CBD5E1]">
                      Pilih Foto
                    </Text>

                    <Text className="mt-1 text-[11px] text-[#64748B]">
                      Maksimal ukuran 2MB
                    </Text>
                  </>
                )}
              </Pressable>
            )}

            {/* Description */}
            <Text className="mb-2 text-sm font-semibold text-[#CBD5E1]">
              Deskripsi
            </Text>

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Deskripsi menu..."
              placeholderTextColor="#64748B"
              multiline
              textAlignVertical="top"
              className="mb-5 min-h-[100px] rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3.5 text-sm text-white"
            />

            {/* Availability */}
            <View className="mb-6 flex-row items-center justify-between rounded-xl border border-[#1E293B] bg-[#111827] px-4 py-3.5">
              <View className="flex-1 pr-4">
                <Text className="text-sm font-semibold text-white">
                  Status Menu
                </Text>

                <Text className="mt-1 text-xs text-[#64748B]">
                  Menu bisa dipesan jika status tersedia
                </Text>
              </View>

              <Pressable
                onPress={() => setIsAvailable((current) => !current)}
                className={`h-7 w-12 justify-center rounded-full px-1 ${
                  isAvailable ? "bg-[#2563EB]" : "bg-[#334155]"
                }`}
              >
                <View
                  className={`h-5 w-5 rounded-full bg-white ${
                    isAvailable ? "self-end" : "self-start"
                  }`}
                />
              </Pressable>
            </View>

            {/* Buttons */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={onClose}
                disabled={loading}
                className="flex-1 items-center justify-center rounded-xl border border-[#1E293B] bg-[#111827] py-3.5 active:bg-[#1E293B]"
              >
                <Text className="text-sm font-semibold text-[#CBD5E1]">
                  Batal
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSubmit}
                disabled={loading}
                className="flex-1 flex-row items-center justify-center rounded-xl bg-[#2563EB] py-3.5 active:bg-[#1D4ED8]"
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={18}
                      color="#FFFFFF"
                    />

                    <Text className="ml-2 text-sm font-bold text-white">
                      {editingMenu ? "Simpan Perubahan" : "Tambah Menu"}
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
