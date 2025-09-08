export interface UserInfo {
   idUsuario?: string;
   idLider?: string;
   nombreLider?: string;
   categoria?: string;
   idSucursal?: string;
   sucursal?: string;
   color?: string;
   tienda?: string;
}

export interface UserState {
   logged: boolean;
   infoUser: UserInfo;
   activeStore: number;
}

export interface UserContextType {
   user: UserState;
   dispatchUser: React.Dispatch<any>;
}
