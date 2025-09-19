import { Feather } from "@expo/vector-icons";
import { useContext, useEffect } from "react";
import { ActivityIndicator, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";

import Service from "@/api/Service";
import LayoutWithNavigation from "@/components/LayoutWithNavigation";
import UserContext from "@/context/UserContext";
import { useAxios } from "@/hooks/useAxios";

// Importaciones de interfaces y utils
import { DashboardData } from "@/interfaces";
import { formatCurrency, formatPercentage } from "@/utils/currency.utils";

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

   const dashboardData: DashboardData = data?.data || {
      section1: [],
      section2: [],
      section3: [],
      section4: [],
      section5: [],
      section6: [],
   };

   // Extraer datos de las secciones
   const section1 = dashboardData.section1?.[0];
   const section3 = dashboardData.section3?.[0];
   const section4 = dashboardData.section4?.[0];
   const section5 = dashboardData.section5?.[0];
   const section6 = dashboardData.section6?.[0];

   return (
      <LayoutWithNavigation>
         <View className="flex-1 bg-gray-50">
            <StatusBar barStyle="light-content" backgroundColor="#dc2626" />

            {/* Header */}
            <View className="bg-mn-base pt-12 pb-6 px-6 rounded-b-3xl">
               <View className="flex-row items-center justify-between mt-5">
                  <Text className="text-white text-xl font-bold text-ce">Mi Resumen</Text>

                  <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
                     <Text className="text-white font-bold text-lg">
                        {user?.infoUser?.nombreLider?.charAt(0) || "U"}
                     </Text>
                  </View>
               </View>

               {/* Período y Categoría */}
               <View className="mt-6 flex-row justify-between items-center">
                  <View className="flex-row items-center">
                     <View
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                           backgroundColor: `#${section1?.CategoriaActualColor}` || "#22C55E",
                        }}
                     />
                     <Text className="text-white font-semibold">{section1?.CategoriaActual || "Emprendedor"}</Text>
                  </View>

                  <Text className="text-white/80 text-sm">Período: {section1?.Periodo || ""}</Text>
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
                     {formatCurrency(section1?.MiIngreso || "0")}
                  </Text>

                  <View className="flex-row justify-between">
                     <View>
                        <Text className="text-gray-500 text-xs">Comisiones</Text>
                        <Text className="text-gray-800 font-semibold">
                           {formatCurrency(section1?.MiIngreso || "0")}
                        </Text>
                     </View>
                     <View>
                        <Text className="text-gray-500 text-xs">Compra-Venta</Text>
                        <Text className="text-gray-800 font-semibold">
                           {formatCurrency(section1?.GananciaCompra || "0")}
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
                           {formatCurrency(section1?.MontoCompraPersonalActual || "0")}
                        </Text>

                        <View className="flex-row items-center justify-between">
                           <View>
                              <Text className="text-white/60 text-xs">
                                 Meta {formatCurrency(section1?.MetaCompraPersonalActual || "0")}
                              </Text>
                              <Text className="text-green-300 text-xs">
                                 {formatPercentage(section1?.PorcentajeMetaCompraPersonalActual || 0)}
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
                           <Text className="text-orange-500 text-xs font-medium ml-1">
                              {section3?.SiguienteCategoria || "Líder Premier"}
                           </Text>
                        </View>

                        <Text className="text-gray-600 text-xs mb-1">Compra Personal</Text>
                        <Text className="text-blue-600 text-xl font-bold">
                           {formatCurrency(section1?.MontoCompraPersonalActual || "0")}
                        </Text>

                        <Text className="text-green-500 text-xs mt-1">
                           Meta {formatCurrency(section3?.MetaCompraPersonalReto || "0")} (
                           {formatPercentage(section3?.PorcentajeMetaCompraPersonalReto || 0)})
                        </Text>
                     </View>
                  </View>
               </View>

               {/* Compra Grupo Row */}
               <View className="flex-row mb-4">
                  <View className="flex-1 mr-2">
                     <View className="bg-white rounded-2xl p-4 shadow-sm">
                        <Text className="text-gray-600 text-xs mb-1">Compra Grupo</Text>
                        <Text className="text-2xl font-bold text-gray-800 mb-2">
                           {formatCurrency(section1?.CompraGrupoActual || "0")}
                        </Text>

                        <View className="flex-row items-center">
                           <Text className="text-green-500 text-xs">
                              Meta {formatCurrency(section1?.MetaCompraGrupoActual || "0")} (
                              {formatPercentage(section1?.PorcentajeMetaCompraGrupoActual || 0)})
                           </Text>
                           <Feather name="arrow-down" size={12} color="#22C55E" className="ml-1" />
                        </View>
                     </View>
                  </View>

                  <View className="flex-1 ml-2">
                     <View className="bg-white rounded-2xl p-4 shadow-sm">
                        <Text className="text-gray-600 text-xs mb-1">Compra Grupo Reto</Text>
                        <Text className="text-blue-600 text-2xl font-bold mb-2">
                           {formatCurrency(section3?.CompraGrupoReto || "0")}
                        </Text>

                        <View className="flex-row items-center">
                           <Text className="text-red-500 text-xs">
                              Meta {formatCurrency(section3?.MetaCompraGrupoReto || "0")} (
                              {formatPercentage(section3?.PorcentajeMetaCompraGrupoReto || 0)})
                           </Text>
                           <Feather name="arrow-down" size={12} color="#EF4444" className="ml-1" />
                        </View>
                     </View>
                  </View>
               </View>

               <View className="flex-row mb-4">
                  <View className="flex-1 mr-2">
                     <View className="bg-white rounded-2xl p-4 shadow-sm">
                        <Text className="text-gray-600 text-xs mb-1">Compra Grupo</Text>
                        <Text className="text-2xl font-bold text-gray-800 mb-2">
                           {formatCurrency(section1?.CompraGrupoActual || "0")}
                        </Text>

                        <View className="flex-row items-center">
                           <Text className="text-green-500 text-xs">
                              Meta {formatCurrency(section1?.MetaCompraGrupoActual || "0")} (
                              {formatPercentage(section1?.PorcentajeMetaCompraGrupoActual || 0)})
                           </Text>
                           <Feather name="arrow-down" size={12} color="#22C55E" className="ml-1" />
                        </View>
                     </View>
                  </View>

                  <View className="flex-1 ml-2">
                     <View className="bg-white rounded-2xl p-4 shadow-sm">
                        <Text className="text-gray-600 text-xs mb-1">Compra Grupo Reto</Text>
                        <Text className="text-blue-600 text-2xl font-bold mb-2">
                           {formatCurrency(section3?.CompraGrupoReto || "0")}
                        </Text>

                        <View className="flex-row items-center">
                           <Text className="text-red-500 text-xs">
                              Meta {formatCurrency(section3?.MetaCompraGrupoReto || "0")} (
                              {formatPercentage(section3?.PorcentajeMetaCompraGrupoReto || 0)})
                           </Text>
                           <Feather name="arrow-down" size={12} color="#EF4444" className="ml-1" />
                        </View>
                     </View>
                  </View>
               </View>

               {/* Status Card */}
               <View className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4">
                  <View className="flex-row items-center justify-between">
                     <View className="flex-row items-center">
                        <View
                           className="w-3 h-3 rounded-full mr-2"
                           style={{ backgroundColor: section4?.Color || "#22C55E" }}
                        />
                        <View>
                           <Text className="text-green-800 font-semibold">
                              {section4?.Descripcion || "Emprendedor"}
                           </Text>
                           <Text className="text-green-600 text-xs">Activo</Text>
                        </View>
                     </View>

                     <View className="items-end">
                        <Text className="text-green-600 text-xs">
                           Logrado {section4?.LideresActuales || 0} de {section4?.LideresRequerido || 3} -{" "}
                           {formatPercentage(section4?.Porcentaje || 0)}
                        </Text>
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
                        <Text className="text-gray-800 font-bold text-center">
                           {formatCurrency(section5?.Total || "0")}
                        </Text>
                     </View>

                     <View className="flex-1 bg-white rounded-xl p-3 ml-2">
                        <Text className="text-gray-600 text-xs text-center">Comisionable</Text>
                        <Text className="text-gray-800 font-bold text-center">
                           {formatCurrency(section5?.TotalComisionable || "0")}
                        </Text>
                     </View>
                  </View>
               </View>

               <TouchableOpacity>
                  <View className="bg-mn-primary rounded-2xl p-4 mb-2">
                     <View className="flex-row items-center justify-center">
                        <Text className="text-white font-bold text-lg mr-2">Ingresos</Text>
                        <View className="bg-white/20 rounded-full px-2 py-1">
                           <Text className="text-white text-xs font-semibold">{section6?.Ingresos || 0}</Text>
                        </View>
                     </View>
                  </View>
               </TouchableOpacity>

               <TouchableOpacity>
                  <View className="bg-mn-accent rounded-2xl p-4">
                     <Text className="text-white font-bold text-center text-lg">Cumpleanos</Text>
                  </View>
               </TouchableOpacity>
            </ScrollView>
         </View>
      </LayoutWithNavigation>
   );
};

export default Dashboard;
