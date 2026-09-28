import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { api } from "../config/Api";
import MenuCard from "../components/menuUi/MenuCard";
import type { MenuItem } from "../components/menuUi/MenuCard";
import MenuForm from "../components/menuUi/MenuForm";

type Props = {
  token: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const LIMIT = 5;

const CATEGORIES = ["SEMUA", "MAKANAN", "MINUMAN", "SNACK", "DESSERT", "PAKET"];

const STATUS_FILTERS = [
  {
    label: "SEMUA",
    value: "SEMUA",
  },
  {
    label: "TERSEDIA",
    value: "AVAILABLE",
  },
  {
    label: "HABIS",
    value: "SOLD_OUT",
  },
];

export default function MenuScreens({ token }: Props) {
  const [menuList, setMenuList] = useState<MenuItem[]>([]);

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: LIMIT,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Search yang sedang diketik
  const [search, setSearch] = useState("");

  // Search yang dikirim ke backend setelah debounce
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("SEMUA");

  const [selectedStatus, setSelectedStatus] = useState("SEMUA");

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [formVisible, setFormVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null);

  // Tunggu user selesai mengetik sebelum request ke backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(search.trim());
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // Ambil data menu dari backend
  const fetchMenu = useCallback(
    async (pageNumber: number, replace: boolean = false) => {
      try {
        if (replace && menuList.length === 0) {
          setLoading(true);
        }

        if (!replace) {
          setLoadingMore(true);
        }

        const response = await api.get("/menu", {
          params: {
            page: pageNumber,
            limit: LIMIT,
            search: searchQuery,
            category: selectedCategory === "SEMUA" ? "" : selectedCategory,
            status: selectedStatus === "SEMUA" ? "" : selectedStatus,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data: MenuItem[] = response.data?.data || [];

        const paginationData = response.data?.pagination;

        if (replace) {
          setMenuList(data);
        } else {
          setMenuList((currentList) => {
            const existingIds = new Set(currentList.map((item) => item.id));

            const newItems = data.filter((item) => !existingIds.has(item.id));

            return [...currentList, ...newItems];
          });
        }

        setPagination({
          page: paginationData?.page ?? pageNumber,

          limit: paginationData?.limit ?? LIMIT,

          total: paginationData?.total ?? data.length,

          totalPages: paginationData?.totalPages ?? 1,

          hasNextPage: paginationData?.hasNextPage ?? false,

          hasPreviousPage: paginationData?.hasPreviousPage ?? pageNumber > 1,
        });
      } catch (error: any) {
        console.log("GET MENU ERROR:", error?.response?.data || error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [token, searchQuery, selectedCategory, selectedStatus, menuList.length],
  );

  // Ambil ulang data saat search atau filter berubah
  useEffect(() => {
    fetchMenu(1, true);
  }, [searchQuery, selectedCategory, selectedStatus]);

  // Load halaman berikutnya
  const loadMore = useCallback(() => {
    if (loading || loadingMore) {
      return;
    }

    if (!pagination.hasNextPage) {
      return;
    }

    fetchMenu(pagination.page + 1, false);
  }, [loading, loadingMore, pagination, fetchMenu]);

  // Refresh
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);

      await fetchMenu(1, true);
    } finally {
      setRefreshing(false);
    }
  }, [fetchMenu]);

  // Tambah menu
  const handleAddMenu = () => {
    setEditingMenu(null);
    setFormVisible(true);
  };

  // Edit menu
  const handleEditMenu = (menu: MenuItem) => {
    setEditingMenu(menu);
    setFormVisible(true);
  };

  // Hapus menu
  const handleDeleteMenu = async (id: string) => {
    try {
      await api.delete(`/menu/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchMenu(1, true);
    } catch (error: any) {
      console.log("DELETE MENU ERROR:", error?.response?.data || error);
    }
  };

  // Setelah tambah/edit berhasil
  const handleMenuSaved = async () => {
    setFormVisible(false);
    setEditingMenu(null);

    await fetchMenu(1, true);
  };

  const renderHeader = () => {
    return (
      <View className="px-4 pt-5">
        {/* Header */}
        <View className="mb-5 flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-extrabold text-white">Menu</Text>

            <Text className="mt-1 text-sm text-slate-400">
              Kelola daftar menu restoran
            </Text>
          </View>

          <Pressable
            onPress={handleAddMenu}
            className="h-11 w-11 items-center justify-center rounded-2xl bg-[#2563EB]"
          >
            <Ionicons name="add" size={25} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Search */}
        <View className="mb-4 flex-row items-center rounded-2xl border border-slate-800 bg-[#101826] px-4">
          <Ionicons name="search" size={21} color="#64748B" />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari nama menu..."
            placeholderTextColor="#64748B"
            className="ml-3 h-12 flex-1 text-base text-white"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />

          {search.length > 0 && (
            <Pressable
              onPress={() => setSearch("")}
              className="h-9 w-9 items-center justify-center"
            >
              <Ionicons name="close-circle" size={21} color="#64748B" />
            </Pressable>
          )}
        </View>

        {/* Kategori */}
        <View className="mb-4">
          <Text className="mb-2 text-sm font-bold text-slate-300">
            Kategori
          </Text>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={CATEGORIES}
            keyExtractor={(item) => item}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => {
              const active = selectedCategory === item;

              return (
                <Pressable
                  onPress={() => setSelectedCategory(item)}
                  className={`mr-2 rounded-xl px-4 py-2.5 ${
                    active
                      ? "bg-[#2563EB]"
                      : "border border-slate-800 bg-[#101826]"
                  }`}
                >
                  <Text
                    className={`text-sm font-bold ${
                      active ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>

        {/* Status */}
        <View className="mb-5">
          <Text className="mb-2 text-sm font-bold text-slate-300">Status</Text>

          <View className="flex-row">
            {STATUS_FILTERS.map((item) => {
              const active = selectedStatus === item.value;

              return (
                <Pressable
                  key={item.value}
                  onPress={() => setSelectedStatus(item.value)}
                  className={`mr-2 rounded-xl px-4 py-2.5 ${
                    active
                      ? "bg-[#2563EB]"
                      : "border border-slate-800 bg-[#101826]"
                  }`}
                >
                  <Text
                    className={`text-sm font-bold ${
                      active ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) {
      return <View className="h-6" />;
    }

    return (
      <View className="items-center py-5">
        <ActivityIndicator size="small" color="#60A5FA" />

        <Text className="mt-2 text-xs text-slate-500">
          Memuat menu berikutnya...
        </Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return null;
    }

    return (
      <View className="items-center px-8 py-16">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-[#101826]">
          <Ionicons name="restaurant-outline" size={30} color="#64748B" />
        </View>

        <Text className="text-center text-base font-bold text-white">
          Menu tidak ditemukan
        </Text>

        <Text className="mt-2 text-center text-sm text-slate-500">
          Coba ubah pencarian atau filter yang digunakan.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#080D16]">
      {loading && menuList.length === 0 ? (
        <View className="flex-1">
          {renderHeader()}

          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#60A5FA" />

            <Text className="mt-3 text-sm text-slate-500">Memuat menu...</Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={menuList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="px-4 pb-3">
              <MenuCard
                item={item}
                onEdit={handleEditMenu}
                onDelete={handleDeleteMenu}
              />
            </View>
          )}
          ListHeaderComponent={renderHeader()}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#60A5FA"
              colors={["#60A5FA"]}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 110,
          }}
        />
      )}

      <MenuForm
        visible={formVisible}
        editingMenu={editingMenu}
        onClose={() => {
          setFormVisible(false);
          setEditingMenu(null);
        }}
        onSaved={handleMenuSaved}
      />
    </SafeAreaView>
  );
}
