// https://svelte.dev/docs/svelte-action#types

import type ObsidianCharacterView from "../../main";
import mainStore from "../stores/mainStore";
import { setIcon } from "obsidian";

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


type DiceOptions = {
  dice:string,
  label?: string,
  onRollCallback?:(result:number) => void
}
export const addDice = (element: HTMLElement, diceOptions: DiceOptions) => {
  const results = [];
  const dicePlugin = plugin.diceRollerPlugin;

  if(!dicePlugin) {
    return null;
  }

  let diceRoller;
  plugin.diceRollerPlugin.getRoller(
    diceOptions.dice
  ).then(res => {
    diceRoller = res;
  });

  let callback = diceOptions.onRollCallback;

  const diceButton = element.createEl('button');
  diceButton.addClasses(['clickable-icon','inline-block']);
  
  setIcon(diceButton, 'dices');
  diceButton.createEl('span', {text: diceOptions.label}).addClass('sr-only')

  diceButton.onClickEvent(async () => {
    if(!diceRoller) return;
    results.push(await diceRoller.roll(true));
    if(!callback) return;
    callback(results.last());
  })

  return {
		update: (diceOptions: DiceOptions) => {
      console.log('update dice', diceOptions.dice);
      callback = diceOptions.onRollCallback;
      plugin.diceRollerPlugin.getRoller(
        diceOptions.dice
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
