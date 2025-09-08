import { useState } from "react";
import { useLogOut } from "./useLogOut";

type ApiResponse = {
   success?: boolean;
   message?: string;
   data?: any;
};

type EndpointFn = (...args: any[]) => Promise<{ data: ApiResponse }>;

export const useAxios = (endpoint: EndpointFn, timeout = 0) => {
   const [data, setData] = useState<any>(null);
   const [error, setError] = useState<string>("");
   const [loading, setLoading] = useState<boolean>(false);
   const { setLogOut } = useLogOut();

   const resetData = () => {
      setData(null);
      setError("");
      setLoading(false);
   };

   const fetchData = async (...args: any[]) => {
      try {
         setLoading(true);
         const response = await endpoint(...args);
         const result = response.data;
         console.log("result API", result);
         setData(result);

         if (!result?.success) {
            if (result?.message) setError(result.message);
            else if (Array.isArray(result?.data) && result.data.length > 0 && result.data[0]?.Mensaje)
               setError(result.data[0].Mensaje);
            else setError("Error desconocido en la respuesta del servidor.");
         } else {
            setError("");
         }
      } catch (err: any) {
         console.log(err);
         if (err?.response?.data) {
            setError(err.response.data.type?.toString() || "Error en la API");
         } else {
            setError("Ocurrió un error inesperado.");
         }
         if (err?.response?.status === 401) {
            setLogOut(true);
         }
      } finally {
         if (timeout > 0) setTimeout(() => setLoading(false), timeout);
         else setLoading(false);
      }
   };

   return [fetchData, data, error, loading, setError, resetData] as const;
};
