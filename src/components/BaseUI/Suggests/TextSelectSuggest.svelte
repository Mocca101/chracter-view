<script lang="ts" generics="T">
  import { upperFirst } from "../../../utils/util";

  import { SuggestionDropdown } from "./SuggestDropdown";
  import { onMount } from "svelte";

  let suggestContainer: HTMLInputElement;
  export let placeholder: string = "Search...";

  let suggestDropdown: SuggestionDropdown;

  export let items: () => string[] = () => [];
  export let onSubmit: (value: string) => void = () => {};

  onMount(() => {
    if (suggestDropdown) {
      return;
    }

    suggestDropdown = new SuggestionDropdown(
      suggestContainer,
      () => items().map((item) => upperFirst(item)),
      (submission) => {
        onSubmit(submission);
      }
    );
  });
</script>

<input type="text" bind:this={suggestContainer} {placeholder} />
