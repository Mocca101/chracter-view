<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { HitDice } from "../../types/hitDice";
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

<BaseContainerRect class=" min-w-fit">
  <div class="grid grid-cols-2 mb-2 gap-x-4">
    <span >HitDice</span>
    <span>Used</span>

    <span on:wheel|stopPropagation|preventDefault>
      <TextNumberInput bind:value={hitDice.max} min={1} />
      d
      <TextNumberInput bind:value={hitDice.diceType} min={1} />
    </span>
    <TextNumberInput
      title="used hit dice"
      value={hitDice.used}
      min={0}
      max={hitDice.max}
      showButtons
    />
  </div>

  <span
    class="mx-auto"
    use:addDice={{
      dice: `${toUse}d${hitDice.diceType}`,
      onRollCallback: onRoll,
      label: "Roll selected number of hit die",
    }}
  >
    <label for="hit-dice-to-use" class="sr-only ">Hit dice to use</label>
    <input
      name="hit-dice-to-use"
      min={1}
      max={hitDice.max}
      type="number"
      bind:value={toUse}
      on:wheel|stopPropagation
      on:wheel|preventDefault={(e) => {
        if (e.deltaY > 0) toUse = Math.max(1, toUse - 1);
        else toUse = Math.min(hitDice.max, toUse + 1);
      }}
    />
  </span>
</BaseContainerRect>
