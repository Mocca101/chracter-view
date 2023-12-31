<script lang="ts">
  import { DamageTypesArray } from "../../data/damageTypes";
  import Dropdown from "../BaseUI/Dropdown.svelte";

  export let resistances: string[] = [];

  $: OpenDamageTypes = DamageTypesArray.filter(
    (el) => !resistances.includes(el)
  );

  function addResistance() {
    resistances = [...resistances, OpenDamageTypes[0]];
  }
</script>

<span>Resistances</span>
{#if resistances.length === 0}
  <button on:click={addResistance}>Add Resistance</button>
{/if}
<div class="flex flex-col gap-1">
  {#each resistances as resistance, index}
    <span>
      <Dropdown
        bind:selected={resistances[index]}
        selectables={[resistance, ...OpenDamageTypes]}
      />
      <span>
        <button
          on:click={() =>
            (resistances = resistances.filter((el) => el !== resistance))}
          >X</button
        >
        {#if index === resistances.length - 1}
          <button on:click={addResistance}>+</button>
        {/if}
      </span>
    </span>
  {/each}
</div>
