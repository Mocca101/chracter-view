<script lang="ts">
  import Stat from "./Stat.svelte";
  import TextNumberInput from "../BaseUI/TextNumberInput.svelte";
  import HitPointsUi from "./HitPointsUI.svelte";
  import BaseContainerRound from "../BaseUI/BaseContainerRound.svelte";
  import ModifierField from "../BaseUI/ModifierField.svelte";
  import HitDice from "./HitDice.svelte";
  import type Character from "../../classes/character";
  import BaseContainerRect from "../BaseUI/BaseContainerRect.svelte";
  import ArrayTextField from "../BaseUI/ArrayTextField.svelte";
  import { focusEnd } from "../../utils/actions";
  import PlainHeading from "../BaseUI/Sections/PlainHeading.svelte";

  export let entity: Character;
</script>

<div>
  <div class="flex flex-wrap justify-between">
    <div>
      <h1
        contenteditable
        class="hover:cursor-text"
        bind:innerText={entity.name}
        use:focusEnd
      >
        {entity.name}
      </h1>
      <p>Level: <TextNumberInput bind:value={entity.cr} /></p>
      <PlainHeading
        bind:heading={entity.description}
      />
    </div>

    <div class="flex gap-1 text-center flex-wrap min-w-[212px] mb-2">
      <HitPointsUi bind:hitPoints={entity.hitPoints} />
      <BaseContainerRect class="h-fit" title="Speed">
        <ArrayTextField bind:textArray={entity.speed}/>
      </BaseContainerRect>
      <HitDice
        bind:hitDice={entity.hitDice}
        on:hit-die-rolled={(res) =>
          (entity.hitPoints.current = Math.min(
            entity.hitPoints.max,
            entity.hitPoints.current + res.detail.result
          ))}
      />

      <BaseContainerRound>
        <span
          data-testid="proficiency-bonus"
          class="my-0 overflow-hidden text-center"
        >
          {entity.proficiencyBonus}
        </span>
        <p class="m-0">Proficiency Bonus</p>
      </BaseContainerRound>
      <BaseContainerRound>
        <p class="m-0">{entity.ArmorClass}</p>
        <p class="m-0">Armor Class</p>
      </BaseContainerRound>
      <BaseContainerRound>
        <ModifierField
          value={entity.initiative}
          modifierSource="Initiative"
          class="m-0"
        />
        <p class="m-0">Initiative</p>
      </BaseContainerRound>
    </div>
  </div>
  <div class=" flex flex-wrap gap-1 max-w-xs min-w-[212px]">
    {#each entity.stats as stat, i}
      <Stat bind:stat />
    {/each}
  </div>
</div>
