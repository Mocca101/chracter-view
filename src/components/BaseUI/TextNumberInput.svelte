<script lang="ts">
  import { tick } from "svelte";

  export let testid: string = "text-number-input";

  export let value: number;
  let cachedValue: number = value;
  export let min: number = undefined;
  export let max: number = undefined;
  export let title: string = undefined;

  export let width: string = "3rem";

  export let showButtons: boolean = false;

  let edit: boolean = false;

  let statInputRef;

  async function toggleEdit() {
    edit = !edit;
    if (!edit) {
      validate(value);
      return;
    }

    await tick();

    statInputRef && statInputRef.focus();
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      statInputRef && statInputRef.blur();
    }
  }

  function validate(nv: number) {
    if (nv === null) {
      value = cachedValue;
      return;
    }
    if (nv > max) {
      value = max;
      return;
    }
    if (nv < min) {
      value = min;
      return;
    }
    value = Math.floor(nv);
    cachedValue = value;
  }

  $: increment = () => {
    value++;
    validate(value);
  };

  $: decrement = () => {
    value--;
    validate(value);
  };

  $: hidden = !edit ? "" : "sr-only";
</script>

<span
  on:wheel|preventDefault={(e) => {
    if (e.deltaY > 0) decrement();
    else increment();
  }}
  data-testid={testid}
  class="
    overflow-hidden
    my-0
    text-center
    {$$restProps.class}"
>
  {#if showButtons}
    <button
      tabindex="0"
      on:keypress={(e) => {
        if (e.key === "Enter") decrement();
      }}
      on:click={decrement}
      class="
        m-1
        font-bold focus:text-[var(--interactive-accent-hover)]
        hover:cursor-pointer
        !bg-transparent !border-none !px-1 !py-0
        input-focus
        {hidden}"
      aria-label={`decrement ${title}`} 
      aria-hidden={showButtons && !edit ? "false" : "true"}
    >
      -
    </button>
  {/if}
  {#if edit}
    <input    
      title={title}
      bind:this={statInputRef}
      on:keypress={handleKeyPress}
      on:focusout={toggleEdit}
      on:wheel|stopPropagation
      type="number"
      bind:value
      {min}
      {max}
      class="my-1 input-focus"
      style="max-width: {width};"
    />
  {:else}
    <span
      title={title}
      tabindex="0"
      role="button"
      on:focus={toggleEdit}
      class="
        inline-block
        my-1
        h-[var(--input-height)]
        input-focus
        py-1
        hover:cursor-text
        border-dotted border-0 border-b-2
        "
    >
      {value}
    </span>
  {/if}
  {#if showButtons}
    <button
      tabindex="0"
      on:keypress={(e) => {
        if (e.key === "Enter") increment();
      }}
      on:click={increment}
      class="
        m-1
        font-bold focus:text-[var(--interactive-accent-hover)]
        hover:cursor-pointer
        !bg-transparent !border-none !px-1 !py-0
        input-focus
        {hidden}"
        aria-label={`increment ${title}`} 
        aria-hidden={showButtons && !edit ? "false" : "true"}
    >
      +
    </button>
  {/if}
</span>
