import LayoutWithNavigation from "@/components/LayoutWithNavigation";
import { Feather } from "@expo/vector-icons";
import { ScrollView, StatusBar, Text, View } from "react-native";

export default function Contacts() {
   return (
      <LayoutWithNavigation>
         <View className="flex-1 bg-gray-50">
            <StatusBar barStyle="light-content" backgroundColor="#dc2626" />

            {/* Header */}
            <View className="bg-mn-base pt-12 pb-6 px-6 rounded-b-3xl">
               <Text className="text-white text-xl font-bold text-center">Carrito de Compras</Text>
            </View>

            <ScrollView className="flex-1 px-4 -mt-4" contentContainerStyle={{ paddingBottom: 120 }}>
               {/* Empty Cart State */}
               <View className="bg-white rounded-2xl p-8 mt-4 items-center">
                  <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                     <Feather name="shopping-cart" size={40} color="#9CA3AF" />
                  </View>

                  <Text className="text-xl font-bold text-gray-800 mb-2">Tu carrito está vacío</Text>
                  <Text className="text-gray-600 text-center mb-6">Agrega productos a tu carrito para verlos aquí</Text>

                  <View className="bg-mn-base px-6 py-3 rounded-xl">
                     <Text className="text-white font-medium">Explorar Productos</Text>
                  </View>
               </View>
            </ScrollView>
         </View>
      </LayoutWithNavigation>
   );
}
