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
  style="max-width: {width};"
  title={title ?? ""}
>
  {#if showButtons}
    <span
      role="button"
      tabindex="0"
      on:keypress={(e) => {
        if (e.key === "Enter") decrement();
      }}
      on:click={decrement}
      class="
        focus:border-solid focus:border-0 focus:border-b-2
        font-bold focus:text-[var(--interactive-accent-hover)]
        focus-visible:outline-0
        hover:cursor-pointer
        {hidden}"
    >
      -
    </span>
  {/if}
  {#if edit}
    <input
      bind:this={statInputRef}
      on:keypress={handleKeyPress}
      on:focusout={toggleEdit}
      on:wheel|stopPropagation
      type="number"
      bind:value
      {min}
      {max}
      style="max-width: {width};"
    />
  {:else}
    <span
      tabindex="0"
      role="button"
      on:focus={toggleEdit}
      class="
        focus:outline-1 focus:outline
        py-1 h-[var(--input-height)]
        hover:cursor-text
        border-dotted border-0 border-b-2
        "
    >
      {value}
    </span>
  {/if}
  {#if showButtons}
    <span
      role="button"
      tabindex="0"
      on:keypress={(e) => {
        if (e.key === "Enter") increment();
      }}
      on:click={increment}
      class="
        focus:border-solid focus:border-0 focus:border-b-2
        font-bold focus:text-[var(--interactive-accent-hover)]
        focus-visible:outline-0
        hover:cursor-pointer
        {hidden}"
    >
      +
    </span>
  {/if}
</span>
