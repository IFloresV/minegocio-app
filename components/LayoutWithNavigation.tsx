import { View } from "react-native";

import BottomNavigation from "./BottomNavigation";

interface LayoutWithNavigationProps {
   children: React.ReactNode;
}

export default function LayoutWithNavigation({ children }: LayoutWithNavigationProps) {
   return (
      <View className="flex-1">
         {children}
         <BottomNavigation />
      </View>
   );
}
