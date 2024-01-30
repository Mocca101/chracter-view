<script lang="ts">
  import type Character from "../../classes/character";
  import BaseContainerRect from "../BaseUI/BaseContainerRect.svelte";
  import Dropdown from "../BaseUI/Dropdown.svelte";
  import type { Stat } from "../../types/stats";

  const baseValue: number = 8;
  export let character: Character;

  $: getDC = (abilityDC: Stat) => {
    return baseValue + character.proficiencyBonus + character.modifierCalculation(abilityDC);
  };

  function addDC() {
    character.abilityDCs = [...character.abilityDCs, character.stats[0]];
  }

  function removeDC(slot: number) {
    character.abilityDCs = character.abilityDCs.filter((_, i) => i !== slot);
  }
</script>

<div class=" flex flex-col gap-1 {$$restProps.class}">
  {#if character.abilityDCs.length === 0}
    <button on:click={addDC}>Add Ability Save DC</button>
  {/if}
  {#each character.abilityDCs as abilityDC, index}
    <div class="flex items-center gap-1">
      <BaseContainerRect class="flex items-center gap-1">
        <span>Ability Save DC: </span>
        <span>{getDC(abilityDC)}</span>
        <span>
          (
          <Dropdown
            selectables={character.stats}
            bind:selected={character.abilityDCs[index]}
            key="name"
            options={{
              shorten: true,
            }}
          />
          )
        </span>
      </BaseContainerRect>
      <button on:click={() => removeDC(index)}>-</button>
      {#if index === character.abilityDCs.length - 1}
        <button on:click={addDC}>+</button>
      {/if}
    </div>
  {/each}
</div>
