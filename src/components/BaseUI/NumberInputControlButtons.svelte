<script lang="ts">
  export let value: number;
  export let min: number = 0;
  export let max: number = 20;

  $: increment = () => value <= max && value++;
  $: decrement = () => value > min && value--;

  function handleDecrementKey(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      decrement();
    }
  }

  function handleIncrementKey(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      increment();
    }
  }

</script>
<span >
  <b
    class="
      bg-[var(--interactive-normal)] hover:bg-[var(--interactive-hover)] accent-[var(--interactive-accent)]
      focus:ring-2 focus:ring-[var(--interactive-accent-hover)]
      hover:scale-125"
    role="button"
    tabindex="0"
    aria-label="decrement"
    on:click={decrement}
    on:keydown={handleDecrementKey}
  >
    -
  </b>
  <slot />
  <b
    class="
      bg-[var(--interactive-normal)] hover:bg-[var(--interactive-hover)] accent-[var(--interactive-accent)]
      focus:ring-2 focus:ring-[var(--interactive-accent-hover)]
      hover:scale-125"
    role="button"
    tabindex="0"
    aria-label="increment"
    on:click={increment}
    on:keydown={handleIncrementKey}
  >
    +
  </b>

</span>
