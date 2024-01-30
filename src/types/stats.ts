export interface Stat {
  name: string;
  value: number;
  max?: number;
  min?: number;
}

export function isStat(obj: any): obj is Stat {
  return obj.value !== undefined && obj.name;
}
