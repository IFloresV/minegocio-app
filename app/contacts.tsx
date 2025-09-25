import LayoutWithNavigation from "@/components/LayoutWithNavigation";
import YearAndCampaignSelect from "@/components/YearAndCampaignSelect";
import { Feather } from "@expo/vector-icons";
import { useContext, useEffect, useState } from "react";
import { Alert, FlatList, Linking, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";

import Service from "@/api/Service";
import UserContext from "@/context/UserContext";
import { useAxios } from "@/hooks/useAxios";

import { Contact } from "@/interfaces";

export default function Contacts() {
   const userContext = useContext(UserContext);

   if (!userContext) {
      throw new Error("Contacts must be used within UserProvider");
   }

   const { user } = userContext;
   const [fetchContacts, contactsData, error, loading] = useAxios(Service.ContactsLeader);

   const [contacts, setContacts] = useState<Contact[]>([]);
   const [search, setSearch] = useState<string>("");
   const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
   const [all, setAll] = useState<boolean>(true);
   const [withOrderChecked, setWithOrderChecked] = useState<boolean>(false);
   const [withoutOrderChecked, setWithoutOrderChecked] = useState<boolean>(false);
   const [campaign, setCampaign] = useState<number>(0);

   // Cargar contactos al montar y cuando cambie la campaña
   useEffect(() => {
      loadContacts();
   }, []);

   useEffect(() => {
      console.log("Cambio de campaña detectado:", campaign);
      loadContacts();
   }, [campaign]);

   // Procesar datos cuando lleguen de la API
   useEffect(() => {
      if (contactsData?.data) {
         console.log("Contactos recibidos:", contactsData.data.length);
         setContacts(contactsData.data);
         setFilteredContacts(contactsData.data);
         // Resetear filtros cuando llegan nuevos datos
         setAll(true);
         setWithOrderChecked(false);
         setWithoutOrderChecked(false);
         setSearch("");
      }
   }, [contactsData]);

   const loadContacts = async () => {
      try {
         let payload = { idleader: user.infoUser.idLider, idcampaing: 20 };
         console.log("Cargando contactos con payload:", payload);
         await fetchContacts(payload);
      } catch (error) {
         console.log("Error al cargar contactos:", error);
      }
   };

   const sendWhatsApp = (phoneNumber: string) => {
      const message = "Hola,%20";
      const url = `https://wa.me/+52${phoneNumber}?text=${message}`;
      Linking.canOpenURL(url)
         .then((supported) => {
            if (supported) {
               Linking.openURL(url);
            } else {
               Alert.alert("Error", "WhatsApp no está instalado");
            }
         })
         .catch((err) => console.error("Error al abrir WhatsApp:", err));
   };

   const makeCall = (phoneNumber: string) => {
      const url = `tel:${phoneNumber}`;
      Linking.canOpenURL(url)
         .then((supported) => {
            if (supported) {
               Linking.openURL(url);
            } else {
               Alert.alert("Error", "No se puede realizar la llamada");
            }
         })
         .catch((err) => console.error("Error al hacer llamada:", err));
   };

   const sendEmail = (email: string) => {
      const url = `mailto:${email}`;
      Linking.canOpenURL(url)
         .then((supported) => {
            if (supported) {
               Linking.openURL(url);
            } else {
               Alert.alert("Error", "No hay aplicación de email configurada");
            }
         })
         .catch((err) => console.error("Error al abrir email:", err));
   };

   // Funciones de filtrado
   const filterContacts = (filterType: string) => {
      let filteredData = contacts;
      if (filterType === "withOrder") {
         filteredData = contacts.filter((item) => item.Pedidos > 0);
      } else if (filterType === "withoutOrder") {
         filteredData = contacts.filter((item) => item.Pedidos === 0);
      }
      setFilteredContacts(filteredData);
   };

   const handleSearchChange = (text: string) => {
      setSearch(text);
      if (text.trim() === "") {
         // Si la búsqueda está vacía, aplicar el filtro actual
         if (all) {
            setFilteredContacts(contacts);
         } else if (withOrderChecked) {
            filterContacts("withOrder");
         } else if (withoutOrderChecked) {
            filterContacts("withoutOrder");
         }
      } else {
         // Filtrar por nombre manteniendo el filtro actual de pedidos
         let baseContacts = contacts;
         if (withOrderChecked) {
            baseContacts = contacts.filter((item) => item.Pedidos > 0);
         } else if (withoutOrderChecked) {
            baseContacts = contacts.filter((item) => item.Pedidos === 0);
         }

         const filteredByName = baseContacts.filter((item) =>
            item.NombreContacto.toLowerCase().includes(text.toLowerCase()),
         );
         setFilteredContacts(filteredByName);
      }
   };

   // Cálculos de estadísticas
   const totalContacts = contacts.length;
   const contactsWithOrders = contacts.filter((item) => item.Pedidos > 0).length;
   const contactsWithoutOrders = contacts.filter((item) => item.Pedidos === 0).length;

   // Componente de filtros
   const FilterIndicators = () => (
      <View className="flex-row justify-around bg-white rounded-xl p-4 mx-4 mb-4 shadow-sm">
         <TouchableOpacity
            className={`flex-row items-center px-3 py-2 rounded-lg ${all ? "bg-blue-100" : "bg-gray-50"}`}
            onPress={() => {
               setAll(true);
               setWithOrderChecked(false);
               setWithoutOrderChecked(false);
               filterContacts("all");
               if (search.trim() !== "") {
                  handleSearchChange(search);
               }
            }}
         >
            <View className={`w-4 h-4 rounded mr-2 ${all ? "bg-blue-500" : "bg-gray-300"}`} />
            <Text className="text-blue-900 text-sm font-medium">Total: {totalContacts}</Text>
         </TouchableOpacity>

         <TouchableOpacity
            className={`flex-row items-center px-3 py-2 rounded-lg ${withOrderChecked ? "bg-green-100" : "bg-gray-50"}`}
            onPress={() => {
               setAll(false);
               setWithOrderChecked(true);
               setWithoutOrderChecked(false);
               filterContacts("withOrder");
               if (search.trim() !== "") {
                  handleSearchChange(search);
               }
            }}
         >
            <View className={`w-4 h-4 rounded mr-2 ${withOrderChecked ? "bg-green-500" : "bg-gray-300"}`} />
            <Text className="text-green-900 text-sm font-medium">Con Pedido: {contactsWithOrders}</Text>
         </TouchableOpacity>

         <TouchableOpacity
            className={`flex-row items-center px-3 py-2 rounded-lg ${
               withoutOrderChecked ? "bg-red-100" : "bg-gray-50"
            }`}
            onPress={() => {
               setAll(false);
               setWithOrderChecked(false);
               setWithoutOrderChecked(true);
               filterContacts("withoutOrder");
               if (search.trim() !== "") {
                  handleSearchChange(search);
               }
            }}
         >
            <View className={`w-4 h-4 rounded mr-2 ${withoutOrderChecked ? "bg-red-500" : "bg-gray-300"}`} />
            <Text className="text-red-800 text-sm font-medium">Sin Pedido: {contactsWithoutOrders}</Text>
         </TouchableOpacity>
      </View>
   );

   // Componente de tarjeta de contacto
   const ContactCard = ({ item }: { item: Contact }) => (
      <View className="bg-white rounded-xl p-4 mb-4 mx-4 shadow-sm">
         <View className="bg-gray-100 rounded-lg p-3 mb-4">
            <Text className="text-lg font-semibold text-gray-900 text-center">{item.NombreContacto}</Text>
         </View>

         <View className="flex-row justify-around items-center mb-4">
            {/* Email */}
            <TouchableOpacity
               className="bg-blue-100 w-12 h-12 rounded-full items-center justify-center"
               onPress={() => sendEmail(item.Correo)}
            >
               <Feather name="mail" size={20} color="#3B82F6" />
            </TouchableOpacity>

            {/* Phone */}
            <TouchableOpacity
               className="bg-gray-100 w-12 h-12 rounded-full items-center justify-center"
               onPress={() => makeCall(item.Celular)}
            >
               <Feather name="phone" size={20} color="#6B7280" />
            </TouchableOpacity>

            {/* WhatsApp */}
            <TouchableOpacity
               className="bg-green-100 w-12 h-12 rounded-full items-center justify-center"
               onPress={() => sendWhatsApp(item.Celular)}
            >
               <Feather name="message-circle" size={20} color="#10B981" />
            </TouchableOpacity>
         </View>

         <Text className="text-xs text-gray-600 text-center">Fecha último pedido: {item.FechaUltimoPedido}</Text>
      </View>
   );

   // Mostrar loading mientras carga
   if (loading) {
      return (
         <LayoutWithNavigation>
            <View className="flex-1 bg-gray-50">
               <StatusBar barStyle="light-content" backgroundColor="#dc2626" />
               <View className="bg-mn-base pt-12 pb-6 px-6 rounded-b-3xl">
                  <Text className="text-white text-xl font-bold text-center">Mis Clientes</Text>
               </View>
               <View className="-mt-4">
                  <YearAndCampaignSelect setCampaign={setCampaign} />
               </View>
               <View className="flex-1 justify-center items-center">
                  <Text className="text-gray-600">Cargando contactos...</Text>
               </View>
            </View>
         </LayoutWithNavigation>
      );
   }

   // Mostrar error si hay algún problema
   if (error) {
      return (
         <LayoutWithNavigation>
            <View className="flex-1 bg-gray-50">
               <StatusBar barStyle="light-content" backgroundColor="#dc2626" />
               <View className="bg-mn-base pt-12 pb-6 px-6 rounded-b-3xl">
                  <Text className="text-white text-xl font-bold text-center">Mis Clientes</Text>
               </View>
               <View className="-mt-4">
                  <YearAndCampaignSelect setCampaign={setCampaign} />
               </View>
               <View className="flex-1 justify-center items-center">
                  <Text className="text-red-600">Error al cargar contactos</Text>
                  <TouchableOpacity className="mt-4 bg-blue-500 px-4 py-2 rounded-lg" onPress={loadContacts}>
                     <Text className="text-white">Reintentar</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </LayoutWithNavigation>
      );
   }

   return (
      <LayoutWithNavigation>
         <View className="flex-1 bg-gray-50">
            <StatusBar barStyle="light-content" backgroundColor="#dc2626" />

            {/* Header */}
            <View className="bg-mn-base pt-12 pb-6 px-6 rounded-b-3xl">
               <Text className="text-white text-xl font-bold text-center">Mis Clientes</Text>
            </View>

            {/* Selector de Año y Campaña */}
            <View className="-mt-4">
               <YearAndCampaignSelect setCampaign={setCampaign} />
            </View>

            {/* Contenido principal */}
            {contacts.length > 0 || loading ? (
               <>
                  {/* Filtros */}
                  <View>
                     <FilterIndicators />

                     {/* Barra de búsqueda */}
                     <View className="mx-4 mb-4">
                        <View className="bg-white rounded-xl px-4 py-3 shadow-sm flex-row items-center">
                           <Feather name="search" size={20} color="#6B7280" />
                           <TextInput
                              className="flex-1 ml-3 text-gray-900"
                              placeholder="Buscar contactos..."
                              placeholderTextColor="#9CA3AF"
                              value={search}
                              onChangeText={handleSearchChange}
                           />
                        </View>
                     </View>

                     {/* Lista de contactos */}
                     {filteredContacts.length > 0 ? (
                        <FlatList
                           data={filteredContacts}
                           renderItem={({ item }) => <ContactCard item={item} />}
                           keyExtractor={(item) => item.Id_Contacto.toString()}
                           contentContainerStyle={{ paddingBottom: 120 }}
                           showsVerticalScrollIndicator={false}
                        />
                     ) : (
                        <View className="bg-white rounded-2xl p-8 mt-4 mx-4 items-center">
                           <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                              <Feather name="users" size={40} color="#9CA3AF" />
                           </View>
                           <Text className="text-xl font-bold text-gray-800 mb-2">No hay contactos</Text>
                           <Text className="text-gray-600 text-center">
                              {search
                                 ? "No se encontraron contactos con ese nombre"
                                 : campaign === 0
                                 ? "Selecciona una campaña para ver los contactos"
                                 : "No hay contactos registrados para esta campaña"}
                           </Text>
                        </View>
                     )}
                  </View>
               </>
            ) : (
               <View className="flex-1 justify-center items-center px-8">
                  <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                     <Feather name="calendar" size={40} color="#9CA3AF" />
                  </View>
                  <Text className="text-xl font-bold text-gray-800 mb-2 text-center">
                     {campaign === 0 ? "Selecciona una campaña" : "Cargando contactos..."}
                  </Text>
                  <Text className="text-gray-600 text-center">
                     {campaign === 0
                        ? "Elige un año y una campaña para ver tus contactos"
                        : "Obteniendo información..."}
                  </Text>
               </View>
            )}
         </View>
      </LayoutWithNavigation>
   );
}
