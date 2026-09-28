import React, { useEffect, useState } from "react";
import { BackHandler, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import POSScreens from "../screens/posScreens";
import HomeScreen from "../screens/homeScreens";
import MenuScreens from "../screens/menuScreens";
import BottomNavigation from "../components/homeUi/bottomBar";

import { RootStackParamList } from "../../App";

type MenuName = "Dashboard" | "POS" | "Menu";

type Props = NativeStackScreenProps<RootStackParamList, "MainApp">;

export default function MainApp({ route }: Props) {
  const { user, token } = route.params;

  const [activeMenu, setActiveMenu] = useState<MenuName>("Dashboard");

  useEffect(() => {
    const handleBackPress = () => {
      if (activeMenu !== "Dashboard") {
        setActiveMenu("Dashboard");

        return true;
      }

      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress,
    );

    return () => {
      backHandler.remove();
    };
  }, [activeMenu]);

  const handleMenuPress = (menu: MenuName) => {
    setActiveMenu(menu);
  };

  const renderScreen = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <HomeScreen user={user} token={token} />;

      case "POS":
        return <POSScreens token={token} />;

      case "Menu":
        return <MenuScreens token={token} />;

      default:
        return <HomeScreen user={user} token={token} />;
    }
  };

  return (
    <View className="flex-1 bg-[#080D16]">
      {renderScreen()}

      <BottomNavigation activeMenu={activeMenu} onMenuPress={handleMenuPress} />
    </View>
  );
}
