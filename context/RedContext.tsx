// @context/RedContext.tsx
import React, { createContext, ReactNode, useReducer } from "react";

const SETREDLEADER = "SETREDLEADER";
const CLEARREDLEADER = "CLEARREDLEADER";

interface RedState {
   infoRed: any[];
}

interface RedAction {
   type: string;
   payload?: {
      red: any[];
   };
}

interface RedContextType {
   red: RedState;
   dispatchRed: React.Dispatch<RedAction>;
}

const initialState: RedState = {
   infoRed: [],
};

const redReducer = (state: RedState = initialState, action: RedAction): RedState => {
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
