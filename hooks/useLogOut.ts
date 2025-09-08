import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

export const useLogOut = () => {
   const [logOut, setLogOut] = useState(false);
   const router = useRouter();

   useEffect(() => {
      const Logout = async () => {
         if (logOut) {
            await SecureStore.deleteItemAsync("MiNegocio");
            router.push("/");
         }
      };

      Logout();
   }, [logOut]);

   return { setLogOut };
};
