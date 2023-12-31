<script lang="ts">
  export let widthClass = "w-24";
</script>

<div class="
  shadow-md rounded-full border-double p-2 text-center
  flex flex-col items-center justify-center
  h-24 {widthClass} {$$restProps.class}">
  <slot />
</div>
