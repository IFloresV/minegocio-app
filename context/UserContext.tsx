// @context/UserContext.tsx
import { UserContextType, UserState } from "@/interfaces/user.interfaces";
import { createContext, ReactNode, useReducer } from "react";

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

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

const userReducer = (state: UserState = initialState, action: any): UserState => {
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
