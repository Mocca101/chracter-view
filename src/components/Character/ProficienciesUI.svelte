<script lang="ts">
  import { tools } from "../../data/tools";
  import { armorTypesArray } from "../../types/armorTypes";
  import type { Proficiencies } from "../../types/proficiency";
  import { weaponCategories } from "../../types/weaponTypes";
  import ArrayTextField from "../BaseUI/ArrayTextField.svelte";
  import BaseContainerRect from "../BaseUI/BaseContainerRect.svelte";
  import ChipSuggestList from "../BaseUI/ChipSuggestList.svelte";

  export let proficiencies: Proficiencies;
</script>

<BaseContainerRect title="Proficiencies & Languages" class="max-w-md">
  <p class="text-center">Armor Proficiencies</p>
  <ChipSuggestList
    availableValues={armorTypesArray}
    label="Armor Proficiency"
    filterSelected={true}
    bind:selectedValues={proficiencies.armorProficiencies}
  />
  <p class="text-center">Weapon Proficiencies</p>
  <ChipSuggestList
    availableValues={[...weaponCategories]}
    label="Weapon Proficiency"
    filterSelected={true}
    bind:selectedValues={proficiencies.weaponProficiencies}
  />
  <p class="text-center">Tool Proficiencies</p>
  <ChipSuggestList
    availableValues={[...tools]}
    label="Tool Proficiency"
    filterSelected={true}
    bind:selectedValues={proficiencies.toolProficiencies}
  />
  <p class="text-center">Other Proficiencies</p>
  <ArrayTextField bind:textArray={proficiencies.otherProficiencies} />
  <p class="text-center">Languages</p>
  <ArrayTextField bind:textArray={proficiencies.languages} />
</BaseContainerRect>
