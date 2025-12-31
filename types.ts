
export interface SpeedometerProps {
  value: number; // 0 to 100
  title?: string;
  subtitle?: string;
  className?: string;
}

export enum ReliabilityLevel {
  RELIABLE = 'Reliable',
  FUZZY = 'Fuzzy',
  UNRELIABLE = 'Unreliable'
}
