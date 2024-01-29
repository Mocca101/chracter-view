<script lang="ts">

  export let proficiency: number = 0;
  export let name: string;

  function toggleProficiency() {
    proficiency = (proficiency + 1) % 3;
  }

  $: ariaToggleState = getAriaToggleState(proficiency);

  function getAriaToggleState(p: number): "true" | "mixed" | "false" {
    return p === 2
      ? "true"
      : p === 1
      ? "mixed"
      : "false";
  }
</script>

<div
  role="checkbox"
  aria-checked={ariaToggleState}
  aria-label="Toggle {name} proficiency"
  tabindex="0"
  data-proficiency={proficiency}
  on:keypress={(event) => {
    if (event.key === "Enter" || event.key === " ") {
      toggleProficiency();
    }
  }}
  on:click={toggleProficiency}
  class="
    w-5 h-5 rounded-full bg-[var(--text-normal)]
    focus:ring-2 focus:ring-[var(--interactive-accent-hover)]
    hover:scale-125 hover:cursor-pointer
    relative top-[2px] left-[2px]
    "
>
  <div
    class="
    w-4 h-4 rounded-full bg-[var(--background-primary)]
    relative top-[2px] left-[2px]"
  >
    {#if proficiency === 1 || proficiency === 2}
      <div
        class="
          w-3 h-3 rounded-full bg-[var(--text-normal)]
          relative top-[2px] left-[2px]"
      >
        {#if proficiency === 2}
          <div
            class="
            w-1 h-1 rounded-full bg-[var(--background-primary)]
            relative top-1 left-1"
          />
        {/if}
      </div>
    {/if}
  </div>
</div>
