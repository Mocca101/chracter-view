// https://svelte.dev/docs/svelte-action#types

import type ObsidianCharacterView from "../../main";
import mainStore from "../stores/mainStore";
import { setIcon } from "obsidian";
import type DiceCombo from "../types/diceCombo";

let plugin: ObsidianCharacterView;
mainStore.plugin.subscribe((p) => (plugin = p));

export const focusEnd = (element: HTMLElement) => {
  element.addEventListener('focus', () => {
        const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  });

}

export const addDice = (element: HTMLElement, diceOptions: DiceCombo & { label: string, onRollCallback?:(result:number) => void }) => {
  const results = [];
  const dicePlugin = plugin.diceRollerPlugin;

  if(!dicePlugin) {
    return null;
  }

  let diceRoller;
  plugin.diceRollerPlugin.getRoller(
    `${diceOptions.quantity ?? 1}d${diceOptions.diceType ?? 1}${(diceOptions.modifier ?? 0) >= 0 ? `+${diceOptions.modifier}` : diceOptions.modifier}`
  ).then(res => {
    diceRoller = res;
  });

  const diceButton = element.createEl('button');
  diceButton.addClasses(['clickable-icon','inline-block']);
  
  setIcon(diceButton, 'dices');
  diceButton.createEl('span', {text: diceOptions.label}).addClass('sr-only')

  diceButton.onClickEvent(async () => {
    if(!diceRoller) return;
    results.push(await diceRoller.roll(true));
    if(!diceOptions.onRollCallback) return;
    diceOptions.onRollCallback(results.last());
  })

  return {
		update: (diceOptions: DiceCombo) => {
      plugin.diceRollerPlugin.getRoller(
        `${diceOptions.quantity ?? 1}d${diceOptions.diceType}${diceOptions.modifier >= 0 ? `+${diceOptions.modifier}` : diceOptions.modifier}`
      ).then(res => diceRoller = res);
    },
		destroy: () => {
      diceButton.remove();
    }
	};
}

// removable svelteAction
export const makeRemovable = (element: HTMLElement, onRemoveCallback: () => void) => {
  let callback = onRemoveCallback;
  if(!callback) return;
  const removeButton = element.createEl('button');
  removeButton.addClasses(['clickable-icon','inline-block']);

  setIcon(removeButton, 'cross');
  removeButton.createEl('span', {text: 'Remove'}).addClass('sr-only')

  removeButton.onClickEvent(() => {
    callback();
  })

  return {
    update: (onRemoveCallback: () => void) => {
      callback = onRemoveCallback;
    },
    destroy: () => {
      removeButton.remove();
    }
  }
}
