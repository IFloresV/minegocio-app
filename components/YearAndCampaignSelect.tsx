import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

import Service from "@/api/Service";
import { useAxios } from "@/hooks/useAxios";

interface Year {
   Anio: string;
}

interface Campaign {
   Id_Campana: number;
   Descripcion: string;
   Vigencia: string;
}

interface YearAndCampaignSelectProps {
   setCampaign: (campaign: number) => void;
}

const YearAndCampaignSelect: React.FC<YearAndCampaignSelectProps> = ({ setCampaign }) => {
   const [years, setYears] = useState<Year[]>([]);
   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
   const [selectedYear, setSelectedYear] = useState<string>("");
   const [selectedYearLabel, setSelectedYearLabel] = useState<string>("Seleccionar año");
   const [selectedCampaign, setSelectedCampaign] = useState<number>(0);
   const [selectedCampaignLabel, setSelectedCampaignLabel] = useState<string>("Seleccionar campaña");

   const [showYearModal, setShowYearModal] = useState(false);
   const [showCampaignModal, setShowCampaignModal] = useState(false);

   const [fetchYears, dataYears, errorYears, loadingYears] = useAxios(Service.PeriodsYears);
   const [fetchCampaigns, dataCampaigns, errorCampaigns, loadingCampaigns] = useAxios(Service.Campaigns);

   useEffect(() => {
      const loadYears = async () => {
         try {
            await fetchYears();
         } catch (error) {
            console.error("Error cargando años:", error);
            Alert.alert("Error", "Ocurrió un error al obtener los años, intente más tarde");
         }
      };
      loadYears();
   }, []);

   useEffect(() => {
      if (dataYears?.data) {
         console.log("Años recibidos:", dataYears.data);
         setYears(dataYears.data);
         if (dataYears.data.length > 0) {
            const defaultYear = "2024"; //dataYears.data[0].Anio;
            setSelectedYear(defaultYear);
            setSelectedYearLabel(defaultYear);
            loadCampaigns(defaultYear);
         }
      }
   }, [dataYears]);

   useEffect(() => {
      if (dataCampaigns?.data) {
         console.log("Campañas recibidas:", dataCampaigns.data);
         const campaignsData = dataCampaigns.data;
         const descendingCampaigns = campaignsData.sort((a: Campaign, b: Campaign) => b.Id_Campana - a.Id_Campana);
         setCampaigns(descendingCampaigns);

         const activeCampaign = descendingCampaigns.find((camp: Campaign) => camp.Vigencia === "Vigente");
         if (activeCampaign) {
            console.log("Campaña vigente encontrada:", activeCampaign);
            const cleanedDescription = activeCampaign.Descripcion.replace(/Campaña/i, "").trim();
            setSelectedCampaign(activeCampaign.Id_Campana);
            setSelectedCampaignLabel(cleanedDescription);
            setCampaign(activeCampaign.Id_Campana);
         } else if (descendingCampaigns.length > 0) {
            console.log("Seleccionando primera campaña:", descendingCampaigns[0]);
            const firstCampaign = descendingCampaigns[0];
            const cleanedDescription = firstCampaign.Descripcion.replace(/Campaña/i, "").trim();
            setSelectedCampaign(firstCampaign.Id_Campana);
            setSelectedCampaignLabel(cleanedDescription);
            setCampaign(firstCampaign.Id_Campana);
         }
      }
   }, [dataCampaigns, setCampaign]);

   const loadCampaigns = async (year: string) => {
      try {
         console.log("📡 Enviando a Campaigns:", { year: year });
         await fetchCampaigns({ year: year }); // 👈 El body debe tener la clave exacta
      } catch (error: any) {
         console.error("❌ Error cargando campañas:", error.response?.data || error.message);
         Alert.alert("Error", "Error al cargar las campañas");
      }
   };

   // Simplificar - siempre usar Modal para evitar problemas con ActionSheetIOS
   const showYearPicker = () => {
      if (years.length === 0) return;
      setShowYearModal(true);
   };

   const showCampaignPicker = () => {
      if (!selectedYear || campaigns.length === 0) return;
      setShowCampaignModal(true);
   };

   const handleYearChange = (year: string) => {
      console.log("Cambio de año a:", year);
      setSelectedYear(year);
      setSelectedYearLabel(year);
      setSelectedCampaign(0);
      setSelectedCampaignLabel("Seleccionar campaña");
      setCampaign(0);
      setCampaigns([]);
      setShowYearModal(false);

      // Pequeño delay para asegurar que el estado se actualice
      setTimeout(() => {
         loadCampaigns("2024");
      }, 100);
   };

   const handleCampaignChange = (campaign: Campaign) => {
      console.log("Cambio de campaña a:", campaign);
      const cleanedDescription = campaign.Descripcion.replace(/Campaña/i, "").trim();
      setSelectedCampaign(campaign.Id_Campana);
      setSelectedCampaignLabel(cleanedDescription);
      setCampaign(campaign.Id_Campana);
      setShowCampaignModal(false);
   };

   return (
      <View className="bg-white mx-4 p-5 shadow-sm rounded-xl mb-4">
         <View className="flex-row gap-2">
            {/* Selector de Año */}
            <View className="w-32">
               <Text className="text-sm font-semibold mb-2 text-gray-700">Año</Text>
               <TouchableOpacity
                  className="border border-gray-300 rounded-lg bg-gray-50 px-3 py-3 flex-row justify-between items-center"
                  onPress={showYearPicker}
                  disabled={loadingYears || years.length === 0}
                  activeOpacity={0.7}
               >
                  <Text className="text-gray-900 text-sm" numberOfLines={1}>
                     {loadingYears ? "Cargando..." : selectedYearLabel}
                  </Text>
                  <Feather name="chevron-down" size={16} color="#6B7280" />
               </TouchableOpacity>
            </View>

            {/* Selector de Campaña */}
            <View className="flex-1">
               <Text className="text-sm font-semibold mb-2 text-gray-700">Campaña</Text>
               <TouchableOpacity
                  className="border border-gray-300 rounded-lg bg-gray-50 px-3 py-3 flex-row justify-between items-center"
                  onPress={showCampaignPicker}
                  disabled={loadingCampaigns || !selectedYear || campaigns.length === 0}
                  activeOpacity={0.7}
               >
                  <Text className="text-gray-900 text-sm flex-1" numberOfLines={1}>
                     {loadingCampaigns ? "Cargando..." : selectedCampaignLabel}
                  </Text>
                  <Feather name="chevron-down" size={16} color="#6B7280" />
               </TouchableOpacity>
            </View>
         </View>

         {/* Indicadores de carga */}
         {(loadingYears || loadingCampaigns) && (
            <View className="mt-2">
               <Text className="text-xs text-gray-500 text-center">
                  {loadingYears ? "Cargando años..." : "Cargando campañas..."}
               </Text>
            </View>
         )}

         {/* Modal para años */}
         <Modal
            visible={showYearModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowYearModal(false)}
            presentationStyle="overFullScreen"
         >
            <View className="flex-1 justify-center items-center bg-black/50">
               <View className="bg-white rounded-xl mx-4 w-80 max-h-96">
                  <View className="p-4">
                     <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-semibold">Seleccionar año</Text>
                        <TouchableOpacity onPress={() => setShowYearModal(false)} className="p-2" activeOpacity={0.7}>
                           <Feather name="x" size={20} color="#6B7280" />
                        </TouchableOpacity>
                     </View>
                     <ScrollView showsVerticalScrollIndicator={false}>
                        {years.map((year, index) => (
                           <TouchableOpacity
                              key={year.Anio}
                              className={`py-4 ${index !== years.length - 1 ? "border-b border-gray-100" : ""}`}
                              onPress={() => handleYearChange(year.Anio)}
                              activeOpacity={0.7}
                           >
                              <Text className="text-base text-gray-900 text-center">{year.Anio}</Text>
                           </TouchableOpacity>
                        ))}
                     </ScrollView>
                  </View>
               </View>
            </View>
         </Modal>

         {/* Modal para campañas */}
         <Modal
            visible={showCampaignModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowCampaignModal(false)}
            presentationStyle="overFullScreen"
         >
            <View className="flex-1 justify-center items-center bg-black/50">
               <View className="bg-white rounded-xl mx-4 w-80 max-h-96">
                  <View className="p-4">
                     <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-semibold">Seleccionar campaña</Text>
                        <TouchableOpacity
                           onPress={() => setShowCampaignModal(false)}
                           className="p-2"
                           activeOpacity={0.7}
                        >
                           <Feather name="x" size={20} color="#6B7280" />
                        </TouchableOpacity>
                     </View>
                     <ScrollView showsVerticalScrollIndicator={false}>
                        {campaigns.map((campaign, index) => {
                           const cleanedDescription = campaign.Descripcion.replace(/Campaña/i, "").trim();
                           return (
                              <TouchableOpacity
                                 key={campaign.Id_Campana}
                                 className={`py-4 ${index !== campaigns.length - 1 ? "border-b border-gray-100" : ""}`}
                                 onPress={() => handleCampaignChange(campaign)}
                                 activeOpacity={0.7}
                              >
                                 <View>
                                    <Text className="text-base text-gray-900 text-center">{cleanedDescription}</Text>
                                    {campaign.Vigencia === "Vigente" && (
                                       <Text className="text-sm text-green-600 mt-1 text-center">• Vigente</Text>
                                    )}
                                 </View>
                              </TouchableOpacity>
                           );
                        })}
                     </ScrollView>
                  </View>
               </View>
            </View>
         </Modal>
      </View>
   );
};

export default YearAndCampaignSelect;
