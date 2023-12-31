<script lang="ts">
  import { createEventDispatcher } from "svelte";

  type T = $$Generic;

  export let allEntries: T[];
  export let placeholderText = "Select...";
  export let titelKey = "title";
  export let selection: T = null;

  let searchInput: HTMLElement;
  let searchValue: string;
  let isFocused = false;

  let baseElement: HTMLElement;

  const dispatcher = createEventDispatcher();

  $: filteredEntries = allEntries.filter((entry) => {
    if (
      getTitle(entry)?.toLowerCase().indexOf(searchValue?.toLowerCase()) >= 0
    ) {
      return true;
    }
    return false;
  });

  function select(selectedEntry: T) {
    selection = selectedEntry;
    searchValue = getTitle(selection);
    console.log(`Selected: ${getTitle(selection)}`);
    dispatcher("selected");
    isFocused = false;
  }

  function getTitle(entry: T): string {
    if (typeof entry === "string") return entry;
    return entry[titelKey];
  }

  function inputFocused() {
    isFocused = true;
    dispatcher("input-focused");
  }
</script>

<form>
  <div>
    <input
      type="text"
      placeholder={placeholderText}
      bind:this={searchInput}
      bind:value={searchValue}
      on:focus={inputFocused}
    />
  </div>

  {#if filteredEntries.length > 0 && isFocused}
    <ul>
      {#each filteredEntries as entry}
        <li>
          <button
            on:click|preventDefault={() => select(entry)}
            on:keydown={(e) => {
              if (e.key === "Enter") select(entry);
            }}
          >
            {getTitle(entry)}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</form>
