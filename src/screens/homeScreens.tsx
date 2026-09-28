import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeHeader from "../components/homeUi/HomeHeader";
import ProfileModal from "../components/homeUi/ProfileModal";

import DashboardStats from "../components/homeUi/Dasboard";
import SalesOverview from "../components/homeUi/SalesOverview";
import OrderStatus from "../components/homeUi/StatusOrder";
import TopSellingMenu from "../components/homeUi/topMenu";
import RecentOrders from "../components/homeUi/NewOrder";

import { api } from "../config/Api";
import { logoutSession } from "../config/session";

type User = {
  id: string;
  name: string;
  email: string;
};

type Props = {
  user: User;
  token: string;
};

export default function HomeScreen({ user, token }: Props) {
  const [orders, setOrders] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [popularMenus, setPopularMenus] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [profileVisible, setProfileVisible] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setError("");

      const [ordersResponse, menusResponse, popularResponse] =
        await Promise.all([
          api.get("/orders", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          api.get("/menu"),
          api.get("/menu/popular"),
        ]);

      setOrders(ordersResponse.data.data || []);
      setMenus(menusResponse.data.data || []);
      setPopularMenus(popularResponse.data.data || []);

      console.log("ORDERS:", ordersResponse.data);

      console.log("MENUS:", menusResponse.data);

      console.log("POPULAR MENUS:", popularResponse.data);
    } catch (err: any) {
      console.log("DASHBOARD API ERROR:", err);

      if (err.response) {
        console.log("STATUS:", err.response.status);

        console.log("DATA:", err.response.data);
      }

      setError("Gagal mengambil data dashboard");
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        await fetchDashboardData();
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token]);

  const onRefresh = async () => {
    try {
      setRefreshing(true);

      await fetchDashboardData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    setProfileVisible(false);

    await logoutSession();
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#080D16]">
        <ActivityIndicator size="large" color="#3697FF" />

        <Text className="mt-4 text-base text-white">Memuat dashboard...</Text>
      </SafeAreaView>
    );
  }

  if (error && orders.length === 0) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-[#080D16] px-6">
        <Text className="text-center text-base text-red-400">{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#080D16]">
      <ImageBackground
        source={require("../../assets/bcg.png")}
        resizeMode="cover"
        blurRadius={4}
        className="flex-1"
        imageStyle={{
          transform: [{ scale: 1.05 }],
        }}
      >
        <View
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(3, 8, 18, 0.58)",
          }}
        />

        <View
          className="absolute inset-0"
          style={{
            backgroundColor: "rgba(8, 25, 50, 0.18)",
          }}
        />

        <View className="flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 120,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#3697FF"
                colors={["#3697FF"]}
                progressBackgroundColor="#111827"
              />
            }
          >
            <HomeHeader
              user={user}
              onProfilePress={() => setProfileVisible(true)}
            />

            <DashboardStats orders={orders} menus={menus} />

            <SalesOverview orders={orders} />

            <OrderStatus orders={orders} />

            <TopSellingMenu popularMenus={popularMenus} />

            <RecentOrders orders={orders} />
          </ScrollView>
        </View>

        <ProfileModal
          visible={profileVisible}
          user={user}
          onClose={() => setProfileVisible(false)}
          onLogout={handleLogout}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
