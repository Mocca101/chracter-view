<script lang="ts">
  import { upperFirst, compose } from "../../utils/util";

  type DropdownOptions = {
    capitalizeFirst?: boolean;
    capitalizeAll?: boolean;
    shorten?: boolean;
    allowEmpty?: boolean;
  };

  type T = $$Generic;

  export let options: DropdownOptions = {
    capitalizeFirst: false,
    capitalizeAll: false,
    shorten: false,
    allowEmpty: false,
  };

  export let selectables: readonly T[];
  $: selectableOptions = options.allowEmpty
    ? [...selectables, null]
    : selectables;
  export let key: string = "text";

  export let selected: T | T[] | null;

  let stringTransformers: ((str: string) => string)[] = [];

  $: {
    if (options.capitalizeFirst) {
      stringTransformers.push(upperFirst);
    }
    if (options.capitalizeAll) {
      stringTransformers.push((str: string) => str.toUpperCase());
    }
    if (options.shorten) {
      stringTransformers.push((str: string) => str.substring(0, 3));
    }
  }

  $: getDisplayName = (selectable) => {
    if (selectable === null) return "--None--";

    if (typeof selectable === "number") {
      return selectable;
    }
    if (typeof selectable === "string") {
      return stringTransformers && stringTransformers.length > 0
        ? compose<string>(
            stringTransformers[0],
            ...stringTransformers
          )(selectable)
        : selectable;
    }
    if (typeof selectable === "object") {
      return stringTransformers && stringTransformers.length > 0
        ? compose<string>(
            stringTransformers[0],
            ...stringTransformers
          )(selectable[key])
        : selectable[key];
    }
  };

  $: isArray = (value: any): value is T[] => {
    return Array.isArray(value);
  };

  $: addElement = () => {
    if (isArray(selected)) {
      selected = [...selected, null];
    }
  };

  $: removeElement = (index: number) => {
    if (isArray(selected)) {
      selected = selected.filter((_, i) => i !== index);
    }
  };
</script>

{#if isArray(selected)}
  {#each selected as option}
    <select
      bind:value={option}
      class=" border-dotted border-0 border-b-2 bg-[var(--background-primary)] shadow-none px-1 py-0"
    >
      {#each selectableOptions as option}
        <option value={option}>
          {getDisplayName(option)}
        </option>
      {/each}
    </select>
  {/each}
  {#if isArray(selected)}
    <button on:click={addElement}>Add</button>
  {/if}
{:else}
  <select
    bind:value={selected}
    class=" border-dotted border-0 border-b-2 bg-[var(--background-primary)] shadow-none px-1 py-0"
  >
    {#each selectableOptions as option}
      <option value={option}>{getDisplayName(option)}</option>
    {/each}
  </select>
{/if}
