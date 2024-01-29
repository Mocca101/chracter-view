<script lang="ts">
  import { upperFirst } from "../../utils/util";

  export let title: string | null = null;
  export let titleClasses: string = "mb-auto";
  export let maxW = "max-w-full";
  export let titleAtTop = false;
  export let titleElement = "h5";

</script>
<div class=" {maxW} border-double rounded-xl py-1 px-2 {$$restProps.class ?? ''}">
  {#if title && titleAtTop}
  <svelte:element this={titleElement} class="text-center mt-0 {titleClasses}">{upperFirst(title)}</svelte:element>
  {/if}
  <slot />
  {#if title && !titleAtTop}
    <svelte:element this={titleElement} class="text-center font-bold mt-0 {titleClasses}">{upperFirst(title)}</svelte:element>
  {/if}
</div>
