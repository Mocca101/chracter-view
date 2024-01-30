<script lang="ts">
  import { addDice } from "../../utils/actions";

  export let value: number;
  export let modifierSource: string;

  $: modifierDisplay = value > 0 ? `+${value}` : value;
</script>

<p
  class={$$restProps.class}
  use:addDice={{
    dice: `1d20${value >= 0 ? "+" : ""}${value}`,
    label: `Roll ${modifierSource}`,
  }}
>
  {modifierDisplay}
</p>
