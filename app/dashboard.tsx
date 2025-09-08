import { Feather } from "@expo/vector-icons";
import { useContext, useEffect } from "react";
import { ActivityIndicator, Dimensions, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";

import Service from "@/api/Service";
import UserContext from "@/context/UserContext";
import { useAxios } from "@/hooks/useAxios";

const { width } = Dimensions.get("window");

interface DashboardData {
   section1: Array<{
      CategoriaActual: string;
      CategoriaActualColor: string;
      Periodo: string;
   }>;
   ganancia?: {
      comisiones: number;
      compraVenta: number;
   };
   compraPersonal?: {
      amount: number;
      meta: number;
      percentage: number;
   };
   compraGrupo?: {
      amount: number;
      meta: number;
      percentage: number;
   };
   liderazgo?: {
      level: string;
      progress: number;
   };
}

const Dashboard = () => {
   const userContext = useContext(UserContext);

   if (!userContext) {
      throw new Error("Dashboard must be used within UserProvider");
   }

   const { user } = userContext;
   const [fetchData, data, error, loading] = useAxios(Service.Dashboard);

   useEffect(() => {
      if (user?.infoUser?.idLider) {
         loadDashboard(user.infoUser.idLider);
      }
   }, [user?.infoUser?.idLider]);

   const loadDashboard = async (idLider: string) => {
      const payload = { idleader: idLider };
      await fetchData(payload);
   };

   const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("es-MX", {
         style: "currency",
         currency: "MXN",
         minimumFractionDigits: 2,
      }).format(amount);
   };

   const formatPercentage = (percentage: number) => {
      return `${percentage.toFixed(1)}%`;
   };

   if (loading) {
      return (
         <View className="flex-1 justify-center items-center bg-gray-50">
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text className="mt-4 text-gray-600">Cargando dashboard...</Text>
         </View>
      );
   }

   if (error) {
      return (
         <View className="flex-1 justify-center items-center bg-gray-50 px-4">
            <Feather name="alert-circle" size={48} color="#EF4444" />
            <Text className="mt-4 text-red-600 text-center font-medium">Error al cargar el dashboard</Text>
            <Text className="mt-2 text-gray-600 text-center">{error}</Text>
         </View>
      );
   }

   const dashboardData: DashboardData = data?.data || {};

   return (
      <View className="flex-1 bg-gray-50">
         <StatusBar barStyle="light-content" backgroundColor="#dc2626" />

         {/* Header */}
         <View className="bg-mn-base pt-12 pb-6 px-6 rounded-b-3xl">
            <View className="flex-row items-center justify-between">
               <TouchableOpacity>
                  <Feather name="menu" size={24} color="white" />
               </TouchableOpacity>

               <Text className="text-white text-xl font-bold">Mi Resumen</Text>

               <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
                  <Text className="text-white font-bold text-lg">{user?.infoUser?.nombreLider?.charAt(0) || "U"}</Text>
               </View>
            </View>

            {/* Período y Categoría */}
            <View className="mt-6 flex-row justify-between items-center">
               <View className="flex-row items-center">
                  <View
                     className="w-3 h-3 rounded-full mr-2"
                     style={{
                        backgroundColor: dashboardData.section1?.[0]?.CategoriaActualColor || "#22C55E",
                     }}
                  />
                  <Text className="text-white font-semibold">
                     {dashboardData.section1?.[0]?.CategoriaActual || "Emprendedor"}
                  </Text>
               </View>

               <Text className="text-white/80 text-sm">
                  Período: {dashboardData.section1?.[0]?.Periodo || "12/2024"}
               </Text>
            </View>
         </View>

         <ScrollView
            className="flex-1 px-4 -mt-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
         >
            {/* Ganancia Card */}
            <View className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
               <Text className="text-gray-600 text-sm mb-1">Mi Ganancia</Text>
               <Text className="text-2xl font-bold text-gray-800 mb-4">
                  {formatCurrency(dashboardData.ganancia?.comisiones || 0)}
               </Text>

               <View className="flex-row justify-between">
                  <View>
                     <Text className="text-gray-500 text-xs">Comisiones</Text>
                     <Text className="text-gray-800 font-semibold">
                        {formatCurrency(dashboardData.ganancia?.comisiones || 0)}
                     </Text>
                  </View>
                  <View>
                     <Text className="text-gray-500 text-xs">Compra-Venta</Text>
                     <Text className="text-gray-800 font-semibold">
                        {formatCurrency(dashboardData.ganancia?.compraVenta || 0)}
                     </Text>
                  </View>
               </View>
            </View>

            {/* Cards Container */}
            <View className="flex-row mb-4">
               {/* Compra Personal */}
               <View className="flex-1 mr-2">
                  <View className="bg-blue-600 rounded-2xl p-4">
                     <Text className="text-white/80 text-xs mb-1">Compra Personal</Text>
                     <Text className="text-white text-xl font-bold mb-2">
                        {formatCurrency(dashboardData.compraPersonal?.amount || 124203.89)}
                     </Text>

                     <View className="flex-row items-center justify-between">
                        <View>
                           <Text className="text-white/60 text-xs">
                              Meta {formatCurrency(dashboardData.compraPersonal?.meta || 0)}
                           </Text>
                           <Text className="text-green-300 text-xs">
                              {formatPercentage(dashboardData.compraPersonal?.percentage || 0)}
                           </Text>
                        </View>
                        <Feather name="trending-up" size={16} color="white" />
                     </View>
                  </View>
               </View>

               {/* Mi Reto */}
               <View className="flex-1 ml-2">
                  <View className="bg-white rounded-2xl p-4 shadow-sm">
                     <View className="flex-row items-center mb-2">
                        <Feather name="star" size={16} color="#F59E0B" />
                        <Text className="text-orange-500 text-xs font-medium ml-1">Líder Premier</Text>
                     </View>

                     <Text className="text-gray-600 text-xs mb-1">Compra Personal</Text>
                     <Text className="text-blue-600 text-xl font-bold">{formatCurrency(124203.89)}</Text>

                     <Text className="text-green-500 text-xs mt-1">Meta $1,404.90 (8740.76 %)</Text>
                  </View>
               </View>
            </View>

            {/* Compra Grupo Row */}
            <View className="flex-row mb-4">
               <View className="flex-1 mr-2">
                  <View className="bg-white rounded-2xl p-4 shadow-sm">
                     <Text className="text-gray-600 text-xs mb-1">Compra Grupo</Text>
                     <Text className="text-2xl font-bold text-gray-800 mb-2">{formatCurrency(926.53)}</Text>

                     <View className="flex-row items-center">
                        <Text className="text-green-500 text-xs">Meta $0.00 (0 %)</Text>
                        <Feather name="arrow-down" size={12} color="#22C55E" className="ml-1" />
                     </View>
                  </View>
               </View>

               <View className="flex-1 ml-2">
                  <View className="bg-white rounded-2xl p-4 shadow-sm">
                     <Text className="text-gray-600 text-xs mb-1">Compra Grupo</Text>
                     <Text className="text-blue-600 text-2xl font-bold mb-2">{formatCurrency(926.53)}</Text>

                     <View className="flex-row items-center">
                        <Text className="text-red-500 text-xs">Meta $3,000.00 (-69.12 %)</Text>
                        <Feather name="arrow-down" size={12} color="#EF4444" className="ml-1" />
                     </View>
                  </View>
               </View>
            </View>

            {/* Liderazgo Cards */}
            <View className="flex-row mb-6">
               <View className="flex-1 mr-2">
                  <View className="bg-gray-100 rounded-2xl p-4">
                     <Text className="text-gray-600 text-center font-medium">Liderazgo</Text>
                  </View>
               </View>

               <View className="flex-1 ml-2">
                  <View className="bg-gray-100 rounded-2xl p-4">
                     <Text className="text-gray-600 text-center font-medium">Liderazgo</Text>
                  </View>
               </View>
            </View>

            {/* Status Card */}
            <View className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4">
               <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                     <View className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                     <View>
                        <Text className="text-green-800 font-semibold">Emprendedor</Text>
                        <Text className="text-green-600 text-xs">Activo</Text>
                     </View>
                  </View>

                  <View className="items-end">
                     <Text className="text-green-600 text-xs">Logrado 0 de 3 - 0%</Text>
                     <Feather name="check-circle" size={20} color="#22C55E" />
                  </View>
               </View>
            </View>

            {/* Bottom Action Cards */}
            <View className="bg-mn-base rounded-2xl p-4 mb-4">
               <Text className="text-white font-bold text-center text-lg mb-2">Mi compra facturada C/IVA</Text>

               <View className="flex-row">
                  <View className="flex-1 bg-white rounded-xl p-3 mr-2">
                     <Text className="text-gray-600 text-xs text-center">Total</Text>
                     <Text className="text-gray-800 font-bold text-center">{formatCurrency(151522.0)}</Text>
                  </View>

                  <View className="flex-1 bg-white rounded-xl p-3 ml-2">
                     <Text className="text-gray-600 text-xs text-center">Comisionable</Text>
                     <Text className="text-gray-800 font-bold text-center">{formatCurrency(130776.0)}</Text>
                  </View>
               </View>
            </View>

            <TouchableOpacity>
               <View className="bg-mn-primary rounded-2xl p-4 mb-2">
                  <Text className="text-white font-bold text-center text-lg">Ingresos</Text>
               </View>
            </TouchableOpacity>

            <TouchableOpacity>
               <View className="bg-mn-accent rounded-2xl p-4">
                  <Text className="text-white font-bold text-center text-lg">Cumpleanos</Text>
               </View>
            </TouchableOpacity>
         </ScrollView>
      </View>
   );
};

export default Dashboard;
