<script lang="ts">
  import { afterUpdate } from "svelte";
  import { focusEnd } from "../../utils/actions";

  export let textArray: string[] = [""];

  $: removeItem = (index: number) => {
    textArray = textArray.filter((_, i) => i !== index);
  }

  $: addItem = () => {
    textArray = [...textArray, ""];
  }

  $: handleDel = (index: number) => {
    if (textArray.length > 1 && textArray[index] === "") {
      removeItem(index);
      if(index === 0)
        newFocus = index;
      else
        newFocus = index - 1;
    }
  }

  $: handleKeyPress = (e: KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
      newFocus = index + 1;
    }
    if (e.key === "Backspace") {
      handleDel(index);
    }

    // arrow up/down button should select next/previous list element
    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      textBoxes[index - 1].focus();
    }
    else if (e.key === 'ArrowDown' && index < textArray.length - 1) {
      e.preventDefault();
      textBoxes[index + 1].focus();
    }
  }

  let newFocus: number | undefined = undefined;

  afterUpdate(() => {
    if (newFocus !== undefined) {
      textBoxes[newFocus].focus();
      newFocus = undefined;
    }
  });

  let textBoxes: HTMLParagraphElement[] = [];

</script>
<div class="flex flex-col gap-1 p-0 m-0 ">
  {#if textArray && textArray.length > 0}
    {#each textArray as trait, i}
      <div>
        <p
          use:focusEnd
          contenteditable="true" 
          class="p-0 m-0 border-0 border-b-2 border-dotted input-focus"
          bind:innerText={trait}
          on:keydown={(e) => handleKeyPress(e, i)}
          bind:this={textBoxes[i]}
        >
        </p>
      </div>
    {/each}
  {:else }
      <button on:click={addItem}>Add Text</button>
  {/if}
</div>
