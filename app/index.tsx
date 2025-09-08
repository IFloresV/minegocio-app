import { Feather } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as yup from "yup";

import Service from "../api/Service";
import RedContext from "../context/RedContext";
import UserContext from "../context/UserContext";
import { useAxios } from "../hooks/useAxios";

const logoImage = require("../assets/images/wopzi-mi-negocio-bl.png");

const schemaLogin = yup.object({
   user: yup.string().required("Usuario requerido"),
   password: yup.string().required("Contraseña requerida"),
});

interface JWTPayload {
   user: {
      data: {
         Id_Usuario: string;
         Nombre: string;
         Id_Cliente: string;
         Categoria: string;
         Id_Sucursal: string;
         Sucursal: string;
         Color: string;
      };
   };
}

export default function LoginScreen() {
   const router = useRouter();
   const [showPassword, setShowPassword] = useState(false);

   // Contextos
   const userContext = useContext(UserContext);
   const redContext = useContext(RedContext);

   if (!userContext || !redContext) {
      throw new Error("Error al cargar contextos");
   }

   const { dispatchUser } = userContext;
   const { dispatchRed } = redContext;

   // Hooks de API
   const [fetchLogin, dataLogin, errorLogin, loadingLogin] = useAxios(Service.Login);
   const [fetchRedLeader, dataRedLeader] = useAxios(Service.RedLeader);

   const {
      control,
      handleSubmit,
      formState: { errors },
   } = useForm({
      resolver: yupResolver(schemaLogin),
   });

   const onSubmit = async (formData: { user: string; password: string }) => {
      const payload = {
         user: formData.user,
         password: formData.password,
      };
      await fetchLogin(payload);
   };

   const loadRedLeader = async (idleader: string) => {
      const payloadRedLeader = {
         idleader: idleader,
      };
      await fetchRedLeader(payloadRedLeader);
   };

   useEffect(() => {
      if (dataLogin?.success && dataLogin?.token) {
         try {
            const jwtkey = jwtDecode<JWTPayload>(dataLogin.token.slice(7));
            const { Id_Cliente } = jwtkey.user.data;
            SecureStore.setItemAsync("MiNegocio", dataLogin.token);
            loadRedLeader(Id_Cliente);
         } catch (error) {
            console.error("Error decoding JWT:", error);
         }
      }
   }, [dataLogin]);

   useEffect(() => {
      if (dataRedLeader?.success && dataLogin?.token) {
         try {
            const jwtkey = jwtDecode<JWTPayload>(dataLogin.token.slice(7));
            const { Id_Usuario, Nombre, Id_Cliente, Categoria, Id_Sucursal, Sucursal, Color } = jwtkey.user.data;

            const payload = {
               idUsuario: Id_Usuario,
               idLider: Id_Cliente,
               nombreLider: Nombre,
               categoria: Categoria,
               idSucursal: Id_Sucursal,
               sucursal: Sucursal,
               color: Color,
            };

            dispatchUser({
               type: "LOGIN",
               payload,
               activeStore: 1,
            });

            dispatchRed({
               type: "SETREDLEADER",
               payload: {
                  red: dataRedLeader.data,
               },
            });

            // Navegar al dashboard
            router.replace("/dashboard");
         } catch (error) {
            console.error("Error decoding JWT:", error);
         }
      }
   }, [dataRedLeader]);

   return (
      <View className="flex-1 bg-gradient-to-b from-white via-gray-500 to-red-50">
         <View className="bg-mn-base pt-20 pb-8 px-6 rounded-b-3xl">
            <View className="items-center mt-10">
               <Image source={logoImage} className="w-72 h-24 mx-auto mb-8" resizeMode="contain" />
            </View>
         </View>
         <View className="flex-1 px-6 -mt-6">
            <View className="bg-white rounded-3xl p-6 shadow-lg">
               {/* Campo Usuario */}
               <Controller
                  control={control}
                  name="user"
                  render={({ field: { onChange, onBlur, value } }) => (
                     <View className="mb-6">
                        <Text className="text-gray-700 text-md mb-2">Nombre usuario</Text>
                        <View className="relative">
                           <TextInput
                              className={`border-2 rounded-xl px-12 py-4 text-base ${
                                 errors.user ? "border-red-400 bg-red-50" : "border-gray-200"
                              }`}
                              placeholder="Ingresa tu usuario"
                              placeholderTextColor="#9CA3AF"
                              onBlur={onBlur}
                              onChangeText={onChange}
                              value={value}
                              autoCapitalize="none"
                           />
                           <Feather
                              name="user"
                              size={20}
                              color="#9CA3AF"
                              style={{ position: "absolute", left: 12, top: 16 }}
                           />
                        </View>
                        {errors.user && <Text className="text-red-500 text-md mt-1">• {errors.user.message}</Text>}
                     </View>
                  )}
               />

               {/* Campo Contraseña */}
               <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                     <View className="mb-6">
                        <Text className="text-gray-700 text-md font-medium mb-2">Contraseña</Text>
                        <View className="relative">
                           <TextInput
                              className={`border-2 rounded-xl px-12 py-4 text-base ${
                                 errors.password ? "border-red-400 bg-red-50" : "border-gray-200"
                              }`}
                              placeholder="Ingresa tu contraseña"
                              placeholderTextColor="#9CA3AF"
                              secureTextEntry={!showPassword}
                              onBlur={onBlur}
                              onChangeText={onChange}
                              value={value}
                           />
                           <Feather
                              name="lock"
                              size={20}
                              color="#9CA3AF"
                              style={{ position: "absolute", left: 12, top: 16 }}
                           />
                           <TouchableOpacity
                              onPress={() => setShowPassword(!showPassword)}
                              style={{ position: "absolute", right: 12, top: 16 }}
                           >
                              <Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#9CA3AF" />
                           </TouchableOpacity>
                        </View>
                        {errors.password && (
                           <Text className="text-red-500 text-md mt-1">• {errors.password.message}</Text>
                        )}
                     </View>
                  )}
               />

               {/* Botón Ingresar */}
               <TouchableOpacity
                  onPress={handleSubmit(onSubmit)}
                  disabled={loadingLogin}
                  className={`bg-mn-primary py-4 rounded-xl items-center mb-6 shadow-lg ${
                     loadingLogin ? "opacity-50" : ""
                  }`}
               >
                  {loadingLogin ? (
                     <ActivityIndicator color="#fff" />
                  ) : (
                     <Text className="text-white font-bold text-lg">Ingresar</Text>
                  )}
               </TouchableOpacity>

               {/* Error general */}
               {errorLogin && (
                  <View className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                     <Text className="text-red-600 text-center font-medium">{errorLogin}</Text>
                  </View>
               )}

               {/* Footer */}
               <Text className="text-center text-xs text-gray-500 mt-4">¿Recuperar contraseña?</Text>
            </View>
         </View>
      </View>
   );
}
