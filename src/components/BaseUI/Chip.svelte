<script>
  import { X } from "lucide-svelte";
  import { makeRemovable } from "../../utils/actions";

  export let onRemove = undefined;
</script>

<div
  class="flex items-center px-2 py-1 max-w-fit rounded-full outline outline-1 outline-[var(--text-normal)]"
  use:makeRemovable={onRemove}
>
  <span class="shrink-0">
    <slot />
  </span>
</div>
