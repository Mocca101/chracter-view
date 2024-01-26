<script lang="ts">
    import { focusEnd } from "../../../utils/actions";
    import { type ParagraphSection } from "../../../utils/file/fileSections";
    export let paragraph: ParagraphSection | undefined | null = undefined;

    function updateParagraph() {
        if (!paragraph) return;
        paragraph.editedText = paragraph.text;
    }

    function focusParagraph(node: HTMLElement) {
        node.focus();
        moveCursorToEnd(node);
    }

    function moveCursorToEnd(node: HTMLElement) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            
            updateParagraph();
        }
    }

</script>

{#if paragraph.editedText !== undefined}
    <div 
        use:focusParagraph
        use:focusEnd
        data-testId="editable-paragraph" 
        contenteditable 
        bind:innerText={paragraph.editedText} 
        class="p-1 m-2 hover:cursor-text input-focus"
    />
{:else}
    <div 
        tabindex="0"
        role="textbox"
        class="max-w-full p-1 m-2 whitespace-pre-line hover:cursor-text input-focus"
        aria-label="Edit" 
        on:click={() => updateParagraph()} 
        on:keydown={handleKeyDown}
        >
        {paragraph.text}
    </div>
{/if}

