<script lang="ts">
  import ProficiencyToggle from "./UiElements/ProficiencyToggle.svelte";
  import type { Check } from "../../types/check";
  import { tooltip } from "../../utils/tooltip";
  import { addDice } from "../../utils/actions";

  export let check: Check;
  export let proficiencyBonus: number;

  $: proficency = (): number => {
    if (!check.proficiency || !proficiencyBonus) return 0;
    return check.proficiency * proficiencyBonus;
  };

  $: modifier = check.stat.modifier() + proficency();

  $: modifierComponents = `Stat: ${check.stat.modifier()}
    ${
      proficency() > 0
        ? `+ Proficiency: ${proficiencyBonus} * ${check.proficiency}`
        : ""
    }`;
</script>

<div
  class="flex flex-row gap-1 items-center px-1 m-0 w-max h-5"
  use:addDice={{
    diceType: 20,
    quantity: 1,
    modifier: modifier,
    label: `Roll ${check.name}`,
  }}
  data-testid="skill-container-{check.name}"
>
  <ProficiencyToggle
    bind:proficiency={check.proficiency}
    bind:name={check.name}
  />
  <p data-testid="skill-modifier" use:tooltip title={modifierComponents}>
    {(modifier > 0 ? "+" : "") + modifier}
  </p>
  <p>{check.name}</p>
  <p class="opacity-50">{check.stat.name.substring(0, 3)}</p>
</div>
