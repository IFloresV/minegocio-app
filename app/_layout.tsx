import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

import SplashScreen from "@/components/SplashScreen";
import { RedProvider } from "@/context/RedContext";
import { UserProvider } from "@/context/UserContext";
import { Stack } from "expo-router";

export default function RootLayout() {
   const [isAppReady, setIsAppReady] = useState(false);

   if (!isAppReady) {
      return (
         <SplashScreen
            onFinish={(isCancelled) => {
               !isCancelled && setIsAppReady(true);
            }}
         />
      );
   }

   return (
      <>
         <SafeAreaProvider>
            <UserProvider>
               <RedProvider>
                  <Stack>
                     <Stack.Screen
                        name="index"
                        options={{
                           headerShown: false,
                           title: "",
                        }}
                     />

                     <Stack.Screen
                        name="dashboard"
                        options={{
                           headerShown: false,
                           title: "",
                        }}
                     />
                     <Stack.Screen
                        name="information"
                        options={{
                           headerShown: false,
                           title: "",
                        }}
                     />
                     <Stack.Screen
                        name="contacts"
                        options={{
                           headerShown: false,
                           title: "",
                        }}
                     />
                  </Stack>
               </RedProvider>
            </UserProvider>
         </SafeAreaProvider>
      </>
   );
}
