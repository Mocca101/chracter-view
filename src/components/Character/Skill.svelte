<script lang="ts">
  import ProficiencyToggle from "./UiElements/ProficiencyToggle.svelte";
  import type { Check } from "../../types/check";
  import { tooltip } from "../../utils/tooltip";
  import { addDice } from "../../utils/actions";
  import type {ModifierCalc} from "../../types/modifier";

  export let check: Check;
  export let proficiencyBonus: number;
  export let modifierCalculation: ModifierCalc;

  $: proficency = (): number => {
    if (!check.proficiency || !proficiencyBonus) return 0;
    return check.proficiency * proficiencyBonus;
  };

  $: statModifier = check.stat ? modifierCalculation(check.stat) : 0;

  $: modifier = statModifier + proficency();

  $: modifierComponents = `Stat: ${statModifier}
    ${
      proficency() > 0
        ? `+ Proficiency: ${proficiencyBonus} * ${check.proficiency}`
        : ""
    }`;
</script>

<div
  class="flex flex-row items-center h-5 gap-1 px-1 m-0 w-max"
  use:addDice={{
    dice: `1d20${modifier >= 0 ? "+" : ""}${modifier}`,
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
