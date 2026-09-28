import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type MenuName = "Dashboard" | "POS" | "Menu";

type Props = {
  activeMenu: MenuName;
  onMenuPress: (menu: MenuName) => void;
};

const menus = [
  {
    name: "Dashboard" as MenuName,
    label: "Dashboard",
    icon: "home-outline" as const,
    activeIcon: "home" as const,
  },
  {
    name: "POS" as MenuName,
    label: "POS",
    icon: "cart-outline" as const,
    activeIcon: "cart" as const,
  },
  {
    name: "Menu" as MenuName,
    label: "Menu",
    icon: "restaurant-outline" as const,
    activeIcon: "restaurant" as const,
  },
];

export default function BottomNavigation({ activeMenu, onMenuPress }: Props) {
  return (
    <View className="absolute bottom-3 left-4 right-4">
      {/* CONTAINER BOTTOM NAV */}
      <View
        className="flex-row items-center justify-between px-2 py-2"
        style={{
          backgroundColor: "rgba(7, 20, 40, 0.94)",
          borderRadius: 30,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        {menus.map((menu) => {
          const active = activeMenu === menu.name;

          return (
            <Pressable
              key={menu.name}
              onPress={() => onMenuPress(menu.name)}
              className="flex-1 items-center"
            >
              {/* ACTIVE ITEM */}
              <View className="items-center justify-center px-4 py-2">
                <Ionicons
                  name={active ? menu.activeIcon : menu.icon}
                  size={24}
                  color={active ? "#1c9dff" : "#8197a8"}
                />

                <Text
                  className="mt-1 text-xs font-semibold"
                  style={{
                    color: active ? "#1c59ff" : "#738cba",
                  }}
                >
                  {menu.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
