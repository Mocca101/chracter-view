<script lang="ts">
  import type Character from "../../classes/character";
  import ArrayTextField from "../BaseUI/ArrayTextField.svelte";
  import BaseContainerRect from "../BaseUI/BaseContainerRect.svelte";
  import SenseUi from "./UiElements/SenseUI.svelte";

  export let character: Character;
</script>

<BaseContainerRect class="flex flex-col gap-1" title="Senses">
  {#each character.keySenses as sense, i}
    <SenseUi
      statValue={10 + character.modifierCalculation(sense.base.stat) + character.proficiencyBonus}
      senseText={sense.name}
    />
  {/each}
  <ArrayTextField bind:textArray={character.additionalSenses} />
</BaseContainerRect>
