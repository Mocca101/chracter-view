import type { Stat } from "../types/stats";

export const Strength: Stat = {
  name: "Strength",
  max: 20,
  value: 10,
  min: 1,
};

export const Dexterity: Stat = {
  name: "Dexterity",
  max: 20,
  value: 10,
  min: 1,
};

export const Constitution: Stat = {
  name: "Constitution",
  max: 20,
  value: 10,
  min: 1,
};

export const Intelligence: Stat = {
  name: "Intelligence",
  max: 20,
  value: 10,
  min: 1,
};

export const Wisdom: Stat = {
  name: "Wisdom",
  max: 20,
  value: 10,
  min: 1,
};

export const Charisma: Stat = {
  name: "Charisma",
  max: 20,
  value: 10,
  min: 1,
};

export const defaultDndStats = () =>{ return [
  {
    ...Strength,
    value: 10,
  },
  {
    ...Dexterity,
    value: 10,
  },
  {
    ...Constitution,
    value: 10,
  },
  {
    ...Intelligence,
    value: 10,
  },
  {
    ...Wisdom,
    value: 10,
  },
  {
    ...Charisma,
    value: 10,
  },
]}

export const BaseStats: Array<Stat> = [
  Strength,
  Dexterity,
  Constitution,
  Intelligence,
  Wisdom,
  Charisma,
];
