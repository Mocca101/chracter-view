<script lang="ts">
  import { BaseArmors } from "../../data/BaseArmors";
  import Dropdown from "../BaseUI/Dropdown.svelte";
  import { type Armor } from "../../types/armorTypes";

  export let selectedArmor: Armor;

</script>

<Dropdown selectables={BaseArmors} bind:selected={selectedArmor} key="name" options={{allowEmpty: true}}  />

