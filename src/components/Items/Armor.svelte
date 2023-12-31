<script lang="ts">
  import { type Armor } from "../../types/armorTypes";

  export let armor: Armor;
</script>
<span>
  {armor.name} - {armor.type.toLocaleUpperCase()} - {armor.ac} AC
</span>
