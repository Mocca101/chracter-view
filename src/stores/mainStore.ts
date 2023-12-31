import { writable } from "svelte/store";
import type ObsidianCharacterView from "../main";

const plugin = writable<ObsidianCharacterView>();


export default { plugin };

