
export enum PlantStatus {
  Online = 'ONLINE',
  Offline = 'OFFLINE',
  Maintenance = 'MAINTENANCE',
}

export enum FuelMode {
  NaturalGas = 'NATURAL_GAS',
  Ethanol = 'ETHANOL',
  Biodiesel = 'BIODIESEL',
  FlexNGH2 = 'FLEX_NG_H2',
  FlexEthanolBiodiesel = 'FLEX_ETHANOL_BIODIESEL',
  Nuclear = 'NUCLEAR',
  SolarBess = 'SOLAR_BESS',
  WindBess = 'WIND_BESS',
}

export interface HistoricalDataPoint {
  time: string;
  power: number;
}

export interface EmissionData {
  nox: number;
  sox: number;
  co: number;
  particulates: number;
}

export interface HistoricalEmissionPoint extends EmissionData {
  time: string;
}

export type TurbineStatus = 'active' | 'inactive' | 'error';

export interface Turbine {
  id: number;
  status: TurbineStatus;
  manufacturer: string;
  model: string;
  isoCapacity: number; // in MW
  maintenanceScore: number;
  type: 'Ciclo Rankine' | 'Ciclo Combinado' | 'Eólica';
  // Thermal specific
  rpm?: number;
  temp?: number;
  pressure?: number;
  // Wind specific
  bladeRPM?: number;
  windSpeed?: number;
  powerOutput?: number; // current power output for a single turbine
  history?: any[]; // Keep it generic for now to support both
}


export interface Alert {
  id: number;
  level: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
}

export interface LongHistoricalDataPoint {
  time: string;
  power: number;
  consumption: number;
}

export interface Plant {
  name: string; // The original name acts as a unique ID
  nameKey: string;
  power: number;
  fuelKey: string;
  
  type?: 'standard' | 'upgrade' | 'new';
  statusKey?: string;
  descriptionKey?: string;
  conversion?: number;
  ethanolDemand?: number;
  coordinates?: { lat: number; lng: number };
  identifier?: {
    type: 'location' | 'license';
    valueKey: string;
  };

  locationKey?: string;
  cycleKey?: string;
  generation2023?: number | null;
  emissions2023?: number | null;
  efficiency?: number | null;
  rate?: number | null;
  // FIX: Add optional status property for compatibility
  status?: string;
}

export interface MarketParticipant {
  id: string;
  name: string;
  type: 'Gerador' | 'Distribuidor' | 'Consumidor' | 'Fundo de Investimento';
  capacity?: number; // MW for generators
  demand?: number; // MW for consumers
  price: number; // R$/MWh
}

export interface EnergyTransaction {
  id: string;
  from: string;
  to: string;
  amount: number; // in MEX-kWh
  token: string;
  txHash: string;
  timestamp: string;
}

// Financial / Trading Types
export interface OHLCV {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema7?: number;
  ema25?: number;
}

export interface OrderBookItem {
  price: number;
  amount: number;
  total: number;
  type: 'bid' | 'ask';
}

export interface FundAsset {
  symbol: string;
  name: string;
  allocation: number; // Percentage
  value: number; // Current value
  change24h: number;
}
