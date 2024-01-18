<script lang="ts">
    import { type ParagraphSection } from "../../../utils/fileParser";
    import { Pen } from 'lucide-svelte'

    export let paragraph: ParagraphSection | undefined | null = undefined;
</script>

{#if paragraph.editedText !== undefined}
    <div data-testId="editable-paragraph" contenteditable bind:innerText={paragraph.editedText} class="m-2"/>
{:else}
    <div class="m-2">
        <span class="whitespace-pre-line ">{paragraph.text}</span>
        <div class="p-0 m-0 text-center">
            <button class="p-2 text-center" on:click={() => paragraph.editedText = paragraph.text}>
                <Pen size="12"/>
                <span class="sr-only">Edit</span>
            </button>
        </div>
    </div>
{/if}

