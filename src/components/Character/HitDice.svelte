<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { HitDice } from "../../types/diceCombo";
  import { addDice } from "../../utils/actions";
  import BaseContainerRect from "../BaseUI/BaseContainerRect.svelte";
  import TextNumberInput from "../BaseUI/TextNumberInput.svelte";

  export let hitDice: HitDice;

  let toUse: number = 1;
  const dispatcher = createEventDispatcher();

  function onRoll(result: number) {
    hitDice.used += toUse;
    dispatcher("hit-die-rolled", { result });
  }
</script>

<BaseContainerRect>
  <div class="grid grid-cols-2 mb-2 gap-x-4">
    <span class="my-0">HitDice</span>
    <span>Used</span>

    <span class="my-0" on:wheel|stopPropagation|preventDefault>
      <TextNumberInput bind:value={hitDice.dice.quantity} min={1} />
      d
      <TextNumberInput bind:value={hitDice.dice.diceType} min={1} />
    </span>
    <TextNumberInput
      value={hitDice.used}
      min={0}
      max={hitDice.dice.quantity}
      showButtons
    />
  </div>

  <span
    class="mx-auto"
    use:addDice={{
      diceType: hitDice.dice.diceType,
      modifier: 0,
      quantity: toUse,
      onRollCallback: onRoll,
      label: "Roll selected number of hit die",
    }}
  >
    <input
      min={1}
      max={hitDice.dice.quantity}
      type="number"
      bind:value={toUse}
      on:wheel|stopPropagation
      on:wheel|preventDefault={(e) => {
        if (e.deltaY > 0) toUse = Math.max(1, toUse - 1);
        else toUse = Math.min(hitDice.dice.quantity, toUse + 1);
      }}
    />
  </span>
</BaseContainerRect>
