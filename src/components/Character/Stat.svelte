<script lang="ts">
  import TextNumberInput from "../BaseUI/TextNumberInput.svelte";
  import BaseContainerRound from "../BaseUI/BaseContainerRound.svelte";
  import type { Stat } from "../../types/stats";
  import ModifierField from "../BaseUI/ModifierField.svelte";

  export let stat: Stat;
</script>

<BaseContainerRound>
  <span class="sr-only">Stat Container for: {stat.name}</span>
  <TextNumberInput bind:value={stat.value} bind:min={stat.min} />
  <p class="my-0">{stat.name.substring(0, 3)}</p>
  <ModifierField
    class="my-0"
    value={stat.modifier()}
    modifierSource={stat.name}
  />
</BaseContainerRound>
