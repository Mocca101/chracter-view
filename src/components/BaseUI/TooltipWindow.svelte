<script>
	export let title;
	export let x;
	export let y;

	export let visible = false;
</script>
{#if visible}
<div style="
		top: {y + 5}px;
		left: {x + 5}px;"
	class=" border-solid rounded border-2 shadow-md absolute bg-[var(--background-primary)] p-1"
>{title}
</div>
{/if}

