<script lang="ts">
    import { type HeadingSection } from "../../../utils/fileParser";
    import BaseContainerRect from "../BaseContainerRect.svelte";
    import ParagraphEditor from "./ParagraphEditor.svelte"

    export let heading: HeadingSection | undefined | null;

    $: title = heading?.text.slice(heading.level + 1);

</script>
{#if !heading}    
    <div class="text-center">
        <h1 class="text-2xl font-bold">No Heading Provided</h1>
    </div>
{:else}
    <BaseContainerRect titleAtTop={true} maxW="max-w-full" title={title}>
        {#each heading.subsections as section}
            {#if section.type === 'paragraph'}
                <ParagraphEditor  bind:paragraph={section} />
            {:else if section.type === 'heading'}
                <svelte:self class="my-2" bind:heading={section} />
            {/if}
        {/each}
    </BaseContainerRect>
{/if}