import { Feather } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";

import LayoutWithNavigation from "@/components/LayoutWithNavigation";

import Colors from "@/utils/Colors";
import Service from "../api/Service";
import UserContext from "../context/UserContext";
import { useAxios } from "../hooks/useAxios";

const getDefaultDateStart = () => "2025-01-01";
const getDefaultDateEnd = () => "2025-12-31";
const formatMoney = (value: any) => `$${parseFloat(value || 0).toFixed(2)}`;

const AccountStatus = () => {
   const userContext = useContext(UserContext);

   if (!userContext) {
      throw new Error("AccountStatus must be used within UserProvider");
   }

   const { user } = userContext;
   const [fetchData, data, error, loading] = useAxios(Service.AccountStatus);

   const [datestart, setDatestart] = useState(getDefaultDateStart());
   const [dateend, setDateend] = useState(getDefaultDateEnd());

   const [showAccountDetail, setShowAccountDetail] = useState(false);
   interface AccountData {
      Id_Edocta: number;
      Folio: string;
      Fecha: string;
      Importe: number | string;
      Saldo: number | string;
      Color: string;
   }
   const [selectedAccount, setSelectedAccount] = useState<AccountData | null>(null);

   const [showBalanceDetail, setShowBalanceDetail] = useState(false);
   interface BalanceData {
      balancePositive: number;
      balanceNegative: number;
      total: number;
   }
   const [balanceData, setBalanceData] = useState<BalanceData | null>(null);

   useEffect(() => {
      preLoadData();
   }, []);

   const preLoadData = async () => {
      let payload = {
         idleader: user?.infoUser?.idLider || "",
         datestart: datestart,
         dateend: dateend,
      };
      await fetchData(payload);
   };

   const onSubmit = async () => {
      let payload = {
         idleader: user?.infoUser?.idLider || "",
         datestart,
         dateend,
      };
      await fetchData(payload);
   };

   const itemsEdocta = (dataArr: any[]) => {
      return dataArr.map((item) => {
         const rgb = Colors.hexToRgb ? Colors.hexToRgb(item.Color) : { r: 0, g: 0, b: 0 };
         const safeRgb = rgb ?? { r: 0, g: 0, b: 0 };
         const borderColor = `rgba(${safeRgb.r}, ${safeRgb.g}, ${safeRgb.b}, 0.5)`;

         return (
            <TouchableOpacity key={item.Id_Edocta} onPress={() => openAccountStatusDetail(item)} className="mb-3">
               <View
                  style={{ borderLeftColor: borderColor, borderLeftWidth: 4 }}
                  className="bg-white rounded-xl p-4 shadow-sm"
               >
                  <View className="flex-row justify-between items-center mb-2">
                     <Text style={{ color: item.Color }} className="text-lg font-bold">
                        {item.Folio}
                     </Text>
                     <View className="flex-row items-center">
                        <Text
                           className="text-lg font-bold ml-1"
                           style={{ color: parseFloat(String(item.Importe)) < 0 ? "#ef4444" : "#222" }}
                        >
                           {formatMoney(item.Importe)}
                        </Text>
                     </View>
                  </View>
                  <View className="flex-row justify-between items-center">
                     <View className="flex-row items-center">
                        <Feather name="calendar" size={12} color="#9CA3AF" />
                        <Text className="text-xs text-gray-600 ml-1">{item.Fecha}</Text>
                     </View>
                     <Text
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{
                           backgroundColor: parseFloat(String(item.Saldo)) > 0 ? "#fee2e2" : "transparent",
                           color: parseFloat(String(item.Saldo)) > 0 ? "#ef4444" : "#222",
                        }}
                     >
                        {formatMoney(item.Saldo)}
                     </Text>
                  </View>
               </View>
            </TouchableOpacity>
         );
      });
   };

   const openAccountStatusDetail = (accountData: any) => {
      setSelectedAccount(accountData);
      setShowAccountDetail(true);
   };

   const closeAccountStatusDetail = () => {
      setShowAccountDetail(false);
      setSelectedAccount(null);
   };

   const openBalanceDetail = () => {
      if (data?.data?.saldo?.[0]) {
         setBalanceData({
            balancePositive: data.data.saldo[0].SaldoFavor,
            balanceNegative: data.data.saldo[0].SaldoPorPagar,
            total: data.data.saldo[0].SaldoGlobal,
         });
         setShowBalanceDetail(true);
      }
   };

   const closeBalanceDetail = () => {
      setShowBalanceDetail(false);
      setBalanceData(null);
   };
   const Header = () => (
      <View>
         <StatusBar barStyle="light-content" backgroundColor="#dc2626" />
         <View className="bg-mn-base pt-20 pb-12 px-6 rounded-b-3xl">
            <Text className="text-white text-xl font-bold text-center">Mis Clientes</Text>
         </View>
      </View>
   );

   if (loading && !data) {
      return (
         <LayoutWithNavigation>
            <View className="flex-1 justify-center items-center bg-gray-50">
               <ActivityIndicator size="large" color="#2563eb" />
               <Text className="mt-4 text-gray-600">Cargando estado de cuenta...</Text>
            </View>
         </LayoutWithNavigation>
      );
   }

   if (error) {
      return (
         <View className="flex-1 justify-center items-center bg-gray-50 px-4">
            <Feather name="alert-circle" size={48} color="#EF4444" />
            <Text className="mt-4 text-red-600 text-center font-medium">Error al cargar el estado de cuenta</Text>
            <Text className="mt-2 text-gray-600 text-center">{error}</Text>
         </View>
      );
   }

   return (
      <LayoutWithNavigation>
         <View className="flex-1 bg-gray-50">
            <StatusBar barStyle="light-content" backgroundColor="#2563eb" />

            {/* Header */}
            <View className="bg-mn-base pt-12 pb-6 px-6 rounded-b-3xl">
               <View className="bg-mn-base pt-5 pb-2 px-6 rounded-b-3xl">
                  <Text className="text-white text-xl font-bold text-center">Mi Estado de cuenta</Text>
               </View>

               <View className="mt-2 items-center">
                  <Text className="text-white/80 text-sm mb-1">Saldo Global</Text>
                  <TouchableOpacity onPress={openBalanceDetail} className="flex-row items-center">
                     <Text className="text-white text-2xl font-bold text-center">
                        {formatMoney(data?.data?.saldo?.[0]?.SaldoGlobal)}
                     </Text>
                     <Feather name="info" size={18} color="white" style={{ marginLeft: 8, opacity: 0.8 }} />
                  </TouchableOpacity>
               </View>
            </View>

            {/* Account Status Detail Modal */}
            {showAccountDetail && selectedAccount && (
               <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 z-50 items-center justify-center">
                  <View className="bg-white rounded-2xl p-6 mx-4 w-11/12 max-w-md">
                     <TouchableOpacity onPress={closeAccountStatusDetail} className="absolute top-4 right-4 z-10">
                        <Feather name="x" size={24} color="#000" />
                     </TouchableOpacity>
                     <Text style={{ color: selectedAccount.Color }} className="text-xl font-bold mb-4">
                        {selectedAccount.Folio}
                     </Text>
                     <View className="gap-3">
                        <View className="flex-row justify-between">
                           <Text className="text-gray-600">Fecha:</Text>
                           <Text className="font-bold">{selectedAccount.Fecha}</Text>
                        </View>
                        <View className="flex-row justify-between">
                           <Text className="text-gray-600">Importe:</Text>
                           <Text
                              className="font-bold"
                              style={{
                                 color: parseFloat(String(selectedAccount.Importe)) < 0 ? "#ef4444" : "#222",
                              }}
                           >
                              {formatMoney(selectedAccount.Importe)}
                           </Text>
                        </View>
                        <View className="flex-row justify-between">
                           <Text className="text-gray-600">Saldo:</Text>
                           <Text
                              className="font-bold"
                              style={{
                                 color: parseFloat(String(selectedAccount.Saldo)) > 0 ? "#ef4444" : "#222",
                              }}
                           >
                              {formatMoney(selectedAccount.Saldo)}
                           </Text>
                        </View>
                     </View>
                  </View>
               </View>
            )}

            {/* Balance Detail Modal */}
            {showBalanceDetail && balanceData && (
               <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 z-50 items-center justify-center">
                  <View className="bg-white rounded-2xl p-6 mx-4 w-11/12 max-w-md">
                     <TouchableOpacity onPress={closeBalanceDetail} className="absolute top-4 right-4 z-10">
                        <Feather name="x" size={24} color="#000" />
                     </TouchableOpacity>
                     <Text className="text-xl font-bold mb-4 text-blue-600">Detalle de Saldo</Text>
                     <View className="gap-3">
                        <View className="flex-row justify-between">
                           <Text className="text-gray-600">Saldo a Favor:</Text>
                           <Text className="font-bold text-green-600">{formatMoney(balanceData.balancePositive)}</Text>
                        </View>
                        <View className="flex-row justify-between">
                           <Text className="text-gray-600">Saldo por Pagar:</Text>
                           <Text className="font-bold text-red-600">{formatMoney(balanceData.balanceNegative)}</Text>
                        </View>
                        <View className="h-px bg-gray-300 my-2" />
                        <View className="flex-row justify-between">
                           <Text className="text-gray-800 font-bold">Saldo Global:</Text>
                           <Text className="font-bold text-lg">{formatMoney(balanceData.total)}</Text>
                        </View>
                     </View>
                  </View>
               </View>
            )}

            {/* Search Form Card */}
            <View className="bg-white rounded-2xl p-4 mb-8 mx-5 -mt-2 shadow-sm">
               <Text className="text-gray-700 font-semibold mb-3">Filtrar por fecha</Text>
               <View className="flex-row gap-2 mb-3">
                  <View className="flex-1">
                     <Text className="text-xs text-gray-600 mb-1">Fecha inicio</Text>
                     <TextInput
                        value={datestart}
                        onChangeText={setDatestart}
                        placeholder="YYYY-MM-DD"
                        className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                     />
                  </View>
                  <View className="flex-1">
                     <Text className="text-xs text-gray-600 mb-1">Fecha fin</Text>
                     <View className="flex-row items-center gap-2">
                        <TextInput
                           value={dateend}
                           onChangeText={setDateend}
                           placeholder="YYYY-MM-DD"
                           className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />
                        <TouchableOpacity onPress={onSubmit} disabled={loading} className="bg-blue-600 rounded-lg p-2">
                           <Feather name="search" size={18} color="#fff" />
                        </TouchableOpacity>
                     </View>
                  </View>
               </View>
               <Text className="text-xs text-gray-500 text-right">** Moneda en MXN</Text>
            </View>
            <ScrollView
               className="flex-1 px-4 -mt-4"
               showsVerticalScrollIndicator={false}
               contentContainerStyle={{ paddingBottom: 100 }}
            >
               {/* Items List */}
               {data?.data?.edocta?.length > 0 ? (
                  <View>{itemsEdocta(data.data.edocta)}</View>
               ) : (
                  <View className="bg-white rounded-2xl p-8 items-center">
                     <Feather name="file-text" size={48} color="#9CA3AF" />
                     <Text className="mt-4 text-gray-600 text-center">
                        No hay registros para el período seleccionado
                     </Text>
                  </View>
               )}
            </ScrollView>
         </View>
      </LayoutWithNavigation>
   );
};

export default AccountStatus;
