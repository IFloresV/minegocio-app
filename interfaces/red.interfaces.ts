export interface RedState {
   infoRed: any[];
}

export interface RedAction {
   type: string;
   payload?: {
      red: any[];
   };
}

export interface RedContextType {
   red: RedState;
   dispatchRed: React.Dispatch<RedAction>;
}
