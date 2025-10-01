import LayoutWithNavigation from "@/components/LayoutWithNavigation";
import { Feather } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import {
   ActivityIndicator,
   Alert,
   Image,
   Linking,
   ScrollView,
   StatusBar,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";

import Service from "@/api/Service";
// import { url } from "@/api/url";
import UserContext from "@/context/UserContext";
import { useAxios } from "@/hooks/useAxios";
// import Colors from "@/utils/Colors";
// import Encryption from "@/utils/Encryption";
import Constants from "expo-constants";

const { API_URL, PATH_CATALOGO } = Constants.expoConfig?.extra as Record<string, string>;

const Information = () => {
   const userContext = useContext(UserContext);

   if (!userContext) {
      throw new Error("Information must be used within UserProvider");
   }

   const { user } = userContext;
   const [fetchData, data, error, loading] = useAxios(Service.Information);
   const [fetchSlug, dataSlug, , , , resetDataSlug] = useAxios(Service.CreateSlugCatalog);

   const [profile, setProfile] = useState("");
   const [showCheckSlug, setShowCheckSlug] = useState(false);
   const [showShareSlug, setShowShareSlug] = useState(false);
   const [slugValue, setSlugValue] = useState("");

   useEffect(() => {
      console.log("user", user.infoUser);
      console.log(user.infoUser.idLider);
      loadInformation(parseInt(user.infoUser.idLider ?? "0"));
   }, []);

   useEffect(() => {
      console.log("=== DEBUG DATA ===");
      console.log("data completo:", data);
      console.log("error:", error);
      console.log("loading:", loading);
      console.log("data?.data:", data?.data);
      console.log("data?.success:", data?.success);
      const initialSlug = data?.data?.[0]?.Slug || "";
      setSlugValue(initialSlug);
      setShowShareSlug(initialSlug.length > 0);
   }, [data]);

   useEffect(() => {
      if (dataSlug?.data) {
         if (dataSlug?.success) {
            if (dataSlug?.data[0].Id_SlugCatalogo > 0) {
               Alert.alert("Éxito", dataSlug?.data[0].Mensaje);
               setShowShareSlug(true);
            } else {
               Alert.alert("Error", dataSlug?.data[0].Mensaje);
               setShowShareSlug(false);
            }
         } else {
            Alert.alert("Error", "Ocurrió un error al actualizar tu Nombre ZI");
         }
      }

      return () => {
         resetDataSlug();
      };
   }, [dataSlug]);

   const loadInformation = async (idLider: number) => {
      console.log("loadInformation");
      let payload = {
         idleader: idLider.toString(),
      };
      console.log("payload", payload);
      await fetchData(payload);
   };

   // const FindMyChallenge = (userData: any) => {
   //    if (!userData?.color) return null;

   //    const rgb = Colors.hexToRgb(userData.color);
   //    return (
   //       <View className="w-full p-4">
   //          <View className="flex-col text-sm items-start h-full">
   //             <View
   //                style={{
   //                   backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
   //                }}
   //                className="w-full flex justify-center items-center p-1 rounded-sm shadow-sm h-full"
   //             >
   //                <View className="flex flex-row justify-start items-center gap-1">
   //                   <Feather name="star" size={32} color={`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`} />
   //                   <Text className="text-gray-700 font-bold tracking-wider">{userData.categoria}</Text>
   //                </View>
   //             </View>
   //          </View>
   //       </View>
   //    );
   // };

   const onSubmit = async () => {
      if (slugValue.length === 0) {
         Alert.alert("Error", "Debes ingresar un valor para actualizar tu Nombre ZI");
         return;
      }
      let payload = {
         idleader: user.infoUser.idLider,
         slug: slugValue,
      };

      await fetchSlug(payload);
      setShowCheckSlug(false);
   };

   const handleSlugChange = (text: string) => {
      setSlugValue(text);
      setShowCheckSlug(true);
      setShowShareSlug(false);
   };

   const openCatalog = () => {
      const catalogUrl = `${PATH_CATALOGO}${slugValue}`;
      Linking.canOpenURL(catalogUrl).then((supported) => {
         if (supported) {
            Linking.openURL(catalogUrl);
         } else {
            Alert.alert("Error", "No se puede abrir el catálogo");
         }
      });
   };

   if (loading) {
      return (
         <LayoutWithNavigation>
            <View className="flex-1 bg-gray-100 justify-center items-center">
               <StatusBar barStyle="light-content" backgroundColor="#dc2626" />
               <View className="bg-mn-base pt-16 pb-6 px-6 rounded-b-3xl w-full">
                  <Text className="text-white text-xl font-bold text-center">Mi Información</Text>
               </View>
               <ActivityIndicator size="large" color="#dc2626" />
               <Text className="text-gray-600 mt-4">Cargando información...</Text>
            </View>
         </LayoutWithNavigation>
      );
   }

   return (
      <LayoutWithNavigation>
         <View className="flex-1 bg-gray-100">
            <StatusBar barStyle="light-content" backgroundColor="#dc2626" />

            {/* Header */}
            <View className="bg-mn-base pt-16 pb-6 px-6 rounded-b-3xl">
               <Text className="text-white text-xl font-bold text-center">Mi Información</Text>
            </View>

            <ScrollView
               className="flex-1 px-4 pt-4"
               showsVerticalScrollIndicator={false}
               contentContainerStyle={{ paddingBottom: 120 }}
            >
               {/* Tarjeta de Perfil */}
               <View className="bg-white rounded-lg shadow-lg pb-8 mb-4">
                  {/* Botón Compartir */}

                  {/* Imagen de Fondo */}
                  <View className="h-32 w-full">
                     <Image
                        source={{ uri: "https://zermatinternal.com:3030/Mexico/WopZI/MiNegocio/background_info.png" }}
                        className="w-full h-full rounded-t-lg"
                        resizeMode="cover"
                     />
                  </View>

                  {/* Información de Perfil */}
                  <View className="flex items-center -mt-16">
                     <Image
                        source={{ uri: "https://zermatinternal.com:3030/Mexico/WopZI/MiNegocio/profile.png" }}
                        className="w-32 h-32 border-4 border-white rounded-full"
                     />
                     <Text className="text-2xl text-center capitalize mt-2 font-semibold">
                        {data?.data?.[0]?.NombreCliente}
                     </Text>
                     <Text className="text-gray-700 text-center capitalize">Sucursal - {user.infoUser.sucursal}</Text>
                     <Text className="text-sm text-gray-500 text-center capitalize">
                        Patrocinador - {data?.data?.[0]?.NombrePatrocinador}
                     </Text>
                  </View>
               </View>

               {/* Información Personal */}
               <View className="bg-white rounded-lg shadow-lg p-4 mb-4">
                  <Text className="text-xl text-gray-900 font-bold mb-4">Información Personal</Text>
                  <View className="space-y-3">
                     <View className="flex-row border-b border-gray-200 py-2">
                        <Text className="font-bold w-24">Nombre:</Text>
                        <Text className="text-gray-700 capitalize flex-1">{data?.data?.[0]?.NombreCliente}</Text>
                     </View>
                     <View className="flex-row border-b border-gray-200 py-2">
                        <Text className="font-bold w-24">Cumpleaños:</Text>
                        <Text className="text-gray-700 flex-1">{data?.data?.[0]?.FechaNacimiento}</Text>
                     </View>
                     <View className="flex-row border-b border-gray-200 py-2">
                        <Text className="font-bold w-24">Ingreso:</Text>
                        <Text className="text-gray-700 flex-1">{data?.data?.[0]?.FechaRegistro}</Text>
                     </View>
                     <View className="flex-row border-b border-gray-200 py-2">
                        <Text className="font-bold w-24">Celular:</Text>
                        <Text className="text-gray-700 flex-1">{data?.data?.[0]?.Celular}</Text>
                     </View>
                     <View className="flex-row border-b border-gray-200 py-2">
                        <Text className="font-bold w-24">Teléfono:</Text>
                        <Text className="text-gray-700 flex-1">{data?.data?.[0]?.Telefono}</Text>
                     </View>
                     <View className="flex-row border-b border-gray-200 py-2">
                        <Text className="font-bold w-24">Email:</Text>
                        <Text className="text-gray-700 flex-1">{data?.data?.[0]?.Correo}</Text>
                     </View>
                     <View className="flex-row border-b border-gray-200 py-2">
                        <Text className="font-bold w-24">RFC:</Text>
                        <Text className="text-gray-700 flex-1">{data?.data?.[0]?.Rfc}</Text>
                     </View>
                     <View className="flex-row py-2">
                        <Text className="font-bold w-24">CURP:</Text>
                        <Text className="text-gray-700 flex-1">{data?.data?.[0]?.Curp}</Text>
                     </View>
                  </View>
               </View>

               {/* Información de Crédito */}
               {data?.data?.[0]?.Id_Descuento_Credito > 0 && (
                  <View className="bg-white rounded-lg shadow-lg p-4 mb-4">
                     <Text className="text-xl text-gray-900 font-bold mb-4">Información Crédito</Text>
                     <View className="space-y-3">
                        <View className="flex-row border-b border-gray-200 py-2">
                           <Text className="font-bold w-24">Monto:</Text>
                           <Text className="text-gray-700 flex-1">
                              ${data?.data?.[0]?.MontoCredito?.toLocaleString("es-MX")}
                           </Text>
                        </View>
                        <View className="flex-row border-b border-gray-200 py-2">
                           <Text className="font-bold w-24">Días:</Text>
                           <Text className="text-gray-700 flex-1">{data?.data?.[0]?.DiasCredito}</Text>
                        </View>
                        <View className="flex-row py-2">
                           <Text className="font-bold w-24">Pedidos:</Text>
                           <Text className="text-gray-700 flex-1">{data?.data?.[0]?.PedidosCredito}</Text>
                        </View>
                     </View>
                  </View>
               )}

               {/* Medición Foránea */}
               {data?.data?.[0]?.MediacionForanea > 0 && (
                  <View className="bg-white rounded-lg shadow-lg p-4 mb-4">
                     <Text className="text-xl text-gray-900 font-bold mb-4">Medición Foránea</Text>
                     <View className="space-y-3">
                        <View className="flex-row border-b border-gray-200 py-2 items-center">
                           <Text className="font-bold w-24">Líder MF:</Text>
                           {data?.data?.[0]?.LiderMF === 1 ? (
                              <View className="bg-blue-500 rounded-full p-1">
                                 <Feather name="check" size={10} color="white" />
                              </View>
                           ) : (
                              <Text className="text-gray-700 flex-1">{data?.data?.[0]?.NombreLiderMF}</Text>
                           )}
                        </View>
                        <View className="flex-row border-b border-gray-200 py-2">
                           <Text className="font-bold w-24">Monto:</Text>
                           <Text className="text-gray-700 flex-1">
                              ${data?.data?.[0]?.MontoMF?.toLocaleString("es-MX")}
                           </Text>
                        </View>
                        <View className="flex-row py-2">
                           <Text className="font-bold w-24">Pedidos:</Text>
                           <Text className="text-gray-700 flex-1">{data?.data?.[0]?.PedidosMF}</Text>
                        </View>
                     </View>
                  </View>
               )}

               {/* Configuración Mi Catálogo */}
               <View className="bg-white rounded-lg shadow-lg p-4 mb-8">
                  <Text className="text-xl text-gray-900 font-bold mb-4">Mi Nombre Zermat</Text>

                  <View className="flex-row items-center mb-4">
                     <Text className="mr-2">Nombre:</Text>
                     <TextInput
                        value={slugValue}
                        onChangeText={handleSlugChange}
                        className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm font-bold"
                        placeholder="Ingresa tu nombre"
                     />
                     {showCheckSlug && (
                        <TouchableOpacity onPress={onSubmit} className="ml-2">
                           <Feather name="check" size={20} color="#16a34a" />
                        </TouchableOpacity>
                     )}
                  </View>

                  <View className="flex-row items-center mb-2">
                     <Text className="text-sm font-bold">Mi Catálogo</Text>
                     {showShareSlug && (
                        <TouchableOpacity onPress={openCatalog} className="ml-3">
                           <Feather name="external-link" size={16} color="#2563eb" />
                        </TouchableOpacity>
                     )}
                  </View>
               </View>
            </ScrollView>
         </View>
      </LayoutWithNavigation>
   );
};

export default Information;
