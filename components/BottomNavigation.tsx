import UserContext from "@/context/UserContext";
import { useLogOut } from "@/hooks/useLogOut";
import { Feather } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Animated, Dimensions, Modal, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: screenWidth } = Dimensions.get("window");

interface NavigationItem {
   name: string;
   icon: keyof typeof Feather.glyphMap;
   route: string;
   label: string;
}

// ICONOS CORREGIDOS
const navigationItems: NavigationItem[] = [
   {
      name: "dashboard",
      icon: "home",
      route: "/dashboard",
      label: "Inicio",
   },
   {
      name: "contacts",
      icon: "users", // CAMBIADO de shopping-cart a users
      route: "/contacts",
      label: "Contactos",
   },
   {
      name: "information",
      icon: "info", // CAMBIADO de shopping-cart a info
      route: "/information",
      label: "Información", // CORREGIDO ortografía
   },
];

// Rutas que no existen aún - mostrar mensaje "próximamente"
const unavailableRoutes = ["/multilevelrevenue", "/closeleaders", "/store", "/configuration", "/help"];

const drawerOptions = [
   { icon: "credit-card" as keyof typeof Feather.glyphMap, label: "Mi Estado de cuenta", route: "/accountstatus" },

   { icon: "dollar-sign" as keyof typeof Feather.glyphMap, label: "Mis Ganancias", route: "/multilevelrevenue" },

   { icon: "git-branch" as keyof typeof Feather.glyphMap, label: "Mis Líderes", route: "/closeleaders" },

   { icon: "shopping-bag" as keyof typeof Feather.glyphMap, label: "Mi tienda", route: "/store" },

   { icon: "settings" as keyof typeof Feather.glyphMap, label: "Configuración", route: "/configuration" },
   { icon: "help-circle" as keyof typeof Feather.glyphMap, label: "Ayuda", route: "/help" },
];

export default function BottomNavigation() {
   const router = useRouter();
   const pathname = usePathname();
   const [drawerVisible, setDrawerVisible] = useState(false);
   const [slideAnim] = useState(new Animated.Value(screenWidth));
   const { setLogOut } = useLogOut();

   const insets = useSafeAreaInsets();
   const userContext = useContext(UserContext);
   const userName = userContext?.user?.infoUser?.nombreLider || "Usuario";

   const openDrawer = () => {
      setDrawerVisible(true);
      Animated.timing(slideAnim, {
         toValue: 0,
         duration: 300,
         useNativeDriver: true,
      }).start();
   };

   const closeDrawer = () => {
      Animated.timing(slideAnim, {
         toValue: screenWidth,
         duration: 300,
         useNativeDriver: true,
      }).start(() => {
         setDrawerVisible(false);
      });
   };

   // FUNCIÓN MEJORADA - Solo permite rutas que existen
   const handleNavigation = (route: string) => {
      try {
         // Solo navegar a rutas que sabemos que existen
         if (route === "/dashboard" || route === "/contacts" || route === "/information") {
            router.push(route);
         } else {
            Alert.alert("Próximamente", "Esta funcionalidad estará disponible pronto.", [{ text: "OK" }]);
         }
      } catch (error) {
         console.error(`Error navigating to ${route}:`, error);
         Alert.alert("Error", "No se pudo navegar a esta pantalla");
      }
   };

   // FUNCIÓN MEJORADA - Maneja rutas del drawer SIN ERRORES
   const handleDrawerNavigation = (route: string) => {
      closeDrawer();

      setTimeout(() => {
         if (unavailableRoutes.includes(route)) {
            const sectionLabel = drawerOptions.find((opt) => opt.route === route)?.label || "esta sección";

            Alert.alert("Próximamente", `La sección "${sectionLabel}" estará disponible pronto.`, [{ text: "OK" }]);
            return;
         }

         try {
            router.navigate(route as any);
         } catch (error) {
            console.error(`Error navigating to ${route}:`, error);
            Alert.alert("Error", "No se pudo abrir esta sección");
         }
      }, 300);
   };

   // FUNCIÓN MEJORADA - Confirmación de logout
   const handleLogout = () => {
      closeDrawer();

      setTimeout(() => {
         Alert.alert("Cerrar Sesión", "¿Estás seguro que deseas salir de tu cuenta?", [
            {
               text: "Cancelar",
               style: "cancel",
            },
            {
               text: "Cerrar Sesión",
               style: "destructive",
               onPress: () => {
                  setLogOut(true);
               },
            },
         ]);
      }, 300);
   };

   const isActive = (route: string) => {
      return pathname === route;
   };

   return (
      <>
         <View
            className="absolute bottom-0 left-0 right-0 bg-mn-base rounded-t-3xl shadow-lg"
            style={{
               paddingBottom: insets.bottom,
               marginBottom: 0,
            }}
         >
            <View className="flex-row items-center justify-around py-2 px-4">
               {/* Navigation Items */}
               {navigationItems.map((item) => (
                  <TouchableOpacity
                     key={item.name}
                     onPress={() => handleNavigation(item.route)}
                     className="flex-1 items-center py-2"
                  >
                     <View className={`p-2 rounded-full ${isActive(item.route) ? "bg-white/20" : ""}`}>
                        <Feather name={item.icon} size={24} color="white" />
                     </View>
                     <Text className={`text-xs mt-1 text-white ${isActive(item.route) ? "font-medium" : ""}`}>
                        {item.label}
                     </Text>
                  </TouchableOpacity>
               ))}

               {/* More Options Button */}
               <TouchableOpacity onPress={openDrawer} className="flex-1 items-center py-2">
                  <View className="p-2 rounded-full">
                     <Feather name="more-horizontal" size={24} color="white" />
                  </View>
                  <Text className="text-xs mt-1 text-white">Más</Text>
               </TouchableOpacity>
            </View>
         </View>

         {/* Drawer Modal */}
         <Modal visible={drawerVisible} transparent animationType="none" onRequestClose={closeDrawer}>
            <View className="flex-1 mt-4">
               {/* Overlay */}
               <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1} onPress={closeDrawer} />

               {/* Drawer Content */}
               <Animated.View
                  className="absolute right-0 top-0 bottom-0 bg-white w-80 shadow-2xl"
                  style={{
                     transform: [{ translateX: slideAnim }],
                  }}
               >
                  <StatusBar backgroundColor="rgba(0,0,0,0.5)" barStyle="light-content" />

                  {/* Drawer Header */}
                  <View className="bg-mn-base pt-12 pb-6 px-2">
                     <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                           <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-3">
                              <Text className="text-white font-bold text-sm">{userName.charAt(0).toUpperCase()}</Text>
                           </View>
                           <View>
                              <Text className="text-white font-bold text-sm">{userName}</Text>
                              <Text className="text-white/80 text-xs ">
                                 {userContext?.user?.infoUser?.categoria || "Usuario"}
                              </Text>
                           </View>
                        </View>
                        {/* <TouchableOpacity onPress={closeDrawer}>
                           <Feather name="x" size={24} color="white" />
                        </TouchableOpacity> */}
                     </View>
                  </View>

                  {/* Drawer Options */}
                  <View className="flex-1 pt-4">
                     {drawerOptions.map((option, index) => (
                        <TouchableOpacity
                           key={index}
                           onPress={() => handleDrawerNavigation(option.route)}
                           className="flex-row items-center px-6 py-4 border-b border-gray-100"
                        >
                           <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
                              <Feather name={option.icon} size={20} color="#6B7280" />
                           </View>
                           <Text className="text-gray-800 font-medium flex-1">{option.label}</Text>
                           <Feather name="chevron-right" size={20} color="#9CA3AF" />
                           {/* Indicador de "próximamente" */}
                           {unavailableRoutes.includes(option.route) && (
                              <View className="bg-orange-100 px-2 py-1 rounded-full mr-2">
                                 <Text className="text-orange-600 text-xs font-medium">Próximamente</Text>
                              </View>
                           )}
                        </TouchableOpacity>
                     ))}

                     {/* Logout Option */}
                     <TouchableOpacity
                        onPress={handleLogout}
                        className="flex-row items-center px-6 py-4 mt-4 border-t border-gray-200"
                     >
                        <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-4">
                           <Feather name="log-out" size={20} color="#EF4444" />
                        </View>
                        <Text className="text-red-600 font-medium flex-1">Cerrar Sesión</Text>
                        <Feather name="chevron-right" size={20} color="#EF4444" />
                     </TouchableOpacity>
                  </View>

                  {/* App Version */}
                  <View className="px-6 py-4 border-t border-gray-200">
                     <Text className="text-gray-400 text-xs text-center">Mi Negocio v1.0.0</Text>
                  </View>
               </Animated.View>
            </View>
         </Modal>
      </>
   );
}
