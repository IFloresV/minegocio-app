// @context/RedContext.tsx
import { RedContextType, RedState } from "@/interfaces/red.interfaces";
import { createContext, ReactNode, useReducer } from "react";

const SETREDLEADER = "SETREDLEADER";
const CLEARREDLEADER = "CLEARREDLEADER";

const initialState: RedState = {
   infoRed: [],
};

const redReducer = (state: RedState = initialState, action: any): RedState => {
   switch (action.type) {
      case SETREDLEADER:
         return {
            infoRed: action.payload?.red || [],
         };
      case CLEARREDLEADER:
         return {
            infoRed: [],
         };
      default:
         return state;
   }
};

const RedContext = createContext<RedContextType | undefined>(undefined);

interface RedProviderProps {
   children: ReactNode;
}

export const RedProvider = ({ children }: RedProviderProps) => {
   const [red, dispatchRed] = useReducer(redReducer, initialState);

   return <RedContext.Provider value={{ red, dispatchRed }}>{children}</RedContext.Provider>;
};

export default RedContext;
