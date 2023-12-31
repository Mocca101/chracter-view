<script lang="ts">
  import TooltipWindow from "./TooltipWindow.svelte";

  export let tooltipText: string = "";

	let tooltipComponent: TooltipWindow = new TooltipWindow({
    props: {
      title: tooltipText,
      x: 0,
      y: 0,
    },
    target: document.body,
  });


  function showTooltip(event) {
    tooltipComponent.$set({
      visible: true,
    });
  }

  function mouseMove(event) {
		tooltipComponent.$set({
			x: event.pageX,
			y: event.pageY,
		});
	}

  function hideTooltip() {
    tooltipComponent.$set({
      visible: false,
    });
  }


</script>
<div
  role="tooltip"
  on:mouseover={showTooltip}
  on:focus={showTooltip}
  on:mousemove={mouseMove}
  on:mouseleave={hideTooltip}
>
  <slot/>
</div>
