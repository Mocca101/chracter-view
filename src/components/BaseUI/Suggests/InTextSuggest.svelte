<script lang="ts">
  import { SuggestionDropdown } from "./SuggestDropdown";
  import { onMount } from "svelte";
  import ObsidianCharacterView from "../../../main";
  import mainStore from "../../../stores/mainStore";

  let p: ObsidianCharacterView;
  mainStore.plugin.subscribe((plugin) => (p = plugin));

  let suggestContainer: HTMLTextAreaElement;
  let suggestFieldContent: string = "";
  let suggestDropdown: SuggestionDropdown;

  let triggerPosition: number = 0;
  let cursorPosition: number = 0;

  function updateCursorPosition() {
    if (!suggestContainer) return;
    cursorPosition = suggestContainer.selectionStart;
  }

  function insert(
    original: string,
    insertText: string,
    start: number,
    end: number
  ): string {
    const startText = original.slice(0, start + 1);
    const endText = original.slice(end);
    console.log(`INSERT: 
    First: pos(${start}) - ${startText}
    InsertText: ${insertText}
    End: pos(${end}) -  ${endText}
    `);

    return startText + insertText + endText;
  }

  onMount(() => {
    suggestDropdown = new SuggestionDropdown(
      suggestContainer,
      () => p.app.vault.getMarkdownFiles().map((file) => file.basename),
      (submission) => {
        suggestFieldContent = insert(
          suggestFieldContent,
          submission + "]]",
          triggerPosition,
          cursorPosition
        );
        const newCursorPosition = triggerPosition + submission.length + 2;
        console.log(newCursorPosition);
        suggestContainer.setSelectionRange(
          newCursorPosition,
          newCursorPosition
        );
      }
    );

    suggestDropdown.manualTrigger = true;
  });

  $: onSuggestContentChanged(suggestFieldContent);

  function onSuggestContentChanged(newValue: string) {
    updateCursorPosition();
    if (!suggestContainer) return;

    triggerPosition = suggestContainer.selectionStart;
    console.log(
      `triggerPosition ${triggerPosition}, char at position: '${
        newValue[triggerPosition - 1]
      }'`
    );

    const lastOpenSBracket = suggestFieldContent.lastIndexOf(
      "[",
      triggerPosition
    );
    const lastCloseSBracket = suggestFieldContent.lastIndexOf(
      "]",
      triggerPosition
    );

    if (lastOpenSBracket > lastCloseSBracket) {
      triggerPosition = lastOpenSBracket;
    }

    if (hasTwoLeadingBrackets(triggerPosition + 1)) {
      const input = suggestFieldContent.slice(
        triggerPosition + 1,
        cursorPosition
      );

      suggestDropdown.target.dispatchEvent(
        new CustomEvent("open-suggest", {
          detail: input,
        })
      );
    } else {
      suggestDropdown.cancel();
    }
  }

  function hasTwoLeadingBrackets(position: number): boolean {
    return (
      position > 0 && suggestFieldContent.slice(position - 2, position) === "[["
    );
  }

  function handleKeyInput(e: KeyboardEvent) {
    updateCursorPosition();
    switch (e.key) {
      case "Enter":
      case "Escape":
      case "ArrowUp":
      case "ArrowDown":
        if (suggestDropdown.isShowing) {
          e.preventDefault();
        }
        break;
    }
  }
</script>

<textarea
  bind:this={suggestContainer}
  placeholder="Write Something"
  bind:value={suggestFieldContent}
  on:keydown={handleKeyInput}
/>
