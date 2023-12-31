import TooltipWindow from "../components/BaseUI/TooltipWindow.svelte";

export function tooltip(element) {
	let title;
	let tooltipComponent: TooltipWindow = new TooltipWindow({
    props: {
      title: title,
      x: 0,
      y: 0,
    },
    target: document.body,
  });

	function mouseOver(event) {
		// NOTE: remove the `title` attribute, to prevent showing the default browser tooltip
		// remember to set it back on `mouseleave`
		title = element.getAttribute('title');
		element.removeAttribute('title');

    tooltipComponent.$set({
			title: title,
      visible: true,
    });
	}

	function mouseMove(event) {
		tooltipComponent.$set({
			x: event.pageX,
			y: event.pageY,
		})
	}

	function mouseLeave() {
    tooltipComponent.$set({
      visible: false,
    });
		// NOTE: restore the `title` attribute
		element.setAttribute('title', title);
	}

	element.addEventListener('mouseover', mouseOver);
  element.addEventListener('mouseleave', mouseLeave);
	element.addEventListener('mousemove', mouseMove);

	return {
		destroy() {
			element.removeEventListener('mouseover', mouseOver);
			element.removeEventListener('mouseleave', mouseLeave);
			element.removeEventListener('mousemove', mouseMove);
		}
	}
}
