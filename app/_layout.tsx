import { useState } from "react";
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
         <UserProvider>
            <RedProvider>
               <Stack>
                  {/* <Stack.Screen name="login" options={{ headerShown: false }} /> */}
                  <Stack.Screen
                     name="index"
                     options={{
                        headerShown: false,
                        title: "",
                     }}
                  />
                  <Stack.Screen
                     name="login"
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
               </Stack>
            </RedProvider>
         </UserProvider>
      </>
   );
}

// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/useColorScheme';

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
//   });

//   if (!loaded) {
//     // Async font loading only occurs in development.
//     return null;
//   }

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }
