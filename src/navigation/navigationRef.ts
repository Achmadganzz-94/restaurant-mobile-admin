import { createNavigationContainerRef } from "@react-navigation/native";

import { RootStackParamList } from "../../App";

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const goToLogin = () => {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [
        {
          name: "Login",
        },
      ],
    });
  }
};
