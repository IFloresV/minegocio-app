// @context/UserContext.tsx
import React, { createContext, ReactNode, useReducer } from "react";

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

interface UserInfo {
   idUsuario?: string;
   idLider?: string;
   nombreLider?: string;
   categoria?: string;
   idSucursal?: string;
   sucursal?: string;
   color?: string;
   tienda?: string;
}

interface UserState {
   logged: boolean;
   infoUser: UserInfo;
   activeStore: number;
}

interface UserAction {
   type: string;
   payload?: UserInfo;
   activeStore?: number;
}

interface UserContextType {
   user: UserState;
   dispatchUser: React.Dispatch<UserAction>;
}

const initUser = (): UserState => {
   return {
      logged: false,
      infoUser: {},
      activeStore: 0,
   };
};

const initialState: UserState = {
   logged: false,
   infoUser: {},
   activeStore: 0,
};

const userReducer = (state: UserState = initialState, action: UserAction): UserState => {
   switch (action.type) {
      case LOGIN:
         return {
            logged: true,
            infoUser: action.payload || {},
            activeStore: action.activeStore || 0,
         };
      case LOGOUT:
         return {
            logged: false,
            infoUser: {},
            activeStore: 0,
         };
      default:
         return state;
   }
};

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
   children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
   const [user, dispatchUser] = useReducer(userReducer, initialState, initUser);

   return <UserContext.Provider value={{ user, dispatchUser }}>{children}</UserContext.Provider>;
};

export default UserContext;
