import type { BaseCheck } from "../types/check";
import type { Stat } from "../types/stats";
import { App } from "obsidian";

let app: App;

export function initUtils(_app: App) {
  app = _app;
}

export function getStatForCheck(check:BaseCheck, stats:Stat[]) {
  return stats.find(stat => stat.name === check.stat.name);
}

export function upperFirst(str:string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const compose = <T>(fn1: (a: T) => T, ...fns: Array<(a: T) => T>) =>
fns.reduce((prevFn, nextFn) => value => prevFn(nextFn(value)), fn1);



export function statblockFromString(fileString: string): string {
  const startString = '```statblock';
  const endString = '```';
  const statblockStart = fileString.indexOf(startString);
  const statblockEnd = fileString.indexOf(endString , statblockStart + startString.length);

  return fileString.slice(statblockStart + startString.length, statblockEnd);
}

export function commaStringToArray(str: string): string[] {
  return str.split(',').map(item => item.trim());
}

