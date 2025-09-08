export interface DashboardSection1 {
   Seccion1: number;
   CategoriaActual: string;
   CategoriaActualColor: string;
   Periodo: string;
   MiIngreso: string;
   MontoCompraPersonalActual: string;
   MetaCompraPersonalActual: string;
   PorcentajeMetaCompraPersonalActual: number;
   Id_MultinivelFijo: number;
   RequisitoCompraGrupoActual: string;
   CompraGrupoActual: string;
   MetaCompraGrupoActual: string;
   PorcentajeMetaCompraGrupoActual: number;
   MuestraSeccionReto: number;
   GananciaCompra: string;
}

export interface DashboardSection3 {
   Seccion3: number;
   SiguienteCategoria: string;
   SiguienteCategoriaColor: string;
   RequisitoCompraGrupoReto: string;
   MetaCompraPersonalReto: string;
   PorcentajeMetaCompraPersonalReto: number;
   MetaCompraGrupoReto: string;
   CompraGrupoReto: string;
   PorcentajeMetaCompraGrupoReto: number;
}

export interface DashboardSection4 {
   Seccion4: number;
   Id_ObjetivoLider: number;
   Descripcion: string;
   LideresActuales: number;
   LideresRequerido: number;
   Color: string;
   Porcentaje: number;
}

export interface DashboardSection5 {
   Seccion5: number;
   Total: string;
   TotalComisionable: string;
}

export interface DashboardSection6 {
   Seccion6: number;
   Ingresos: number;
   IngresosActivos: number;
   IngresosEfectivos: number;
}

export interface DashboardData {
   section1: Array<DashboardSection1>;
   section2: Array<any>;
   section3: Array<DashboardSection3>;
   section4: Array<DashboardSection4>;
   section5: Array<DashboardSection5>;
   section6: Array<DashboardSection6>;
}

export interface DashboardResponse {
   success: boolean;
   data: DashboardData;
}
