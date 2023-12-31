<script lang="ts">
  import { X, PlusIcon } from "lucide-svelte";
  import Chip from "../BaseUI/Chip.svelte";
  import { upperFirst } from "../../utils/util";
  import TextSelectSuggest from "../BaseUI/Suggests/TextSelectSuggest.svelte";

  export let label: string = "VALUE";

  export let selectedValues: string[] = [];

  export let availableValues: string[] = [];
  export let filterSelected = false;

  $: filteredValues = () => {
    if (!filterSelected) return availableValues;

    return availableValues.filter(
      (value) =>
        !selectedValues
          .map((item) => item.toLowerCase())
          .includes(value.toLowerCase())
    );
  };

  $: addValue = (value: string = null) => {
    if (!value) return;
    selectedValues = [...selectedValues, value];
  };

  let addMode = false;
</script>

<div class="flex flex-wrap gap-1 max-w-fit">
  {#each selectedValues as val, i}
    <Chip
      onRemove={() => {
        selectedValues = selectedValues.filter((_, index) => index !== i);
      }}
    >
      <span>{upperFirst(val)}</span>
    </Chip>
  {/each}
  {#if !addMode}
    <button on:click={() => (addMode = true)} title={`Add ${label}`}>
      <PlusIcon size="16" />
      <span class="sr-only">{`Add ${label}`}</span>
    </button>
  {/if}
  {#if addMode}
    <div>
      <TextSelectSuggest
        items={filteredValues}
        placeholder={label}
        onSubmit={addValue}
      />
      <button on:click={() => (addMode = false)} title="Cancel">
        <X size="16" />
        <span class="sr-only">Cancel</span>
      </button>
    </div>
  {/if}
</div>
