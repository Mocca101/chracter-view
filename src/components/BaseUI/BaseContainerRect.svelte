<script lang="ts">
  import { upperFirst } from "../../utils/util";

  export let title: string | null = null;
  export let titleClasses: string = "mb-auto";

</script>
<div class=" max-w-fit border-double rounded-xl py-1 px-2 {$$restProps.class ?? ''}">
  <slot />
  {#if title}
    <p class="text-center font-bold mt-0 {titleClasses}">{upperFirst(title)}</p>
  {/if}
</div>
