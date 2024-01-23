<script lang="ts">
    import ParagraphEditor from './ParagraphEditor.svelte';
    import { Collapsible } from "bits-ui";
    import { type HeadingSection } from "../../../utils/fileParser";
    import { ChevronDownIcon, ChevronUpIcon, Pen } from 'lucide-svelte'
    import BaseContainerRect from "../BaseContainerRect.svelte";
    import { onMount } from "svelte";
  import AddSubheadingButton from './AddSubheadingButton.svelte';

    export let heading: HeadingSection | undefined | null = undefined;

    export let collapsibleOpen = false;
    export let defaultOpen = true;


    onMount(() => {
        if(!heading) return;
        collapsibleOpen = defaultOpen;
    })

</script>

{#if !heading}
    <div class="text-center">
        <h1 class="text-2xl font-bold">No Heading Provided</h1>
    </div>
{:else}
    <Collapsible.Root bind:open={collapsibleOpen} >
        <BaseContainerRect class="max-w-full {$$restProps.class ?? ''}">
            <Collapsible.Trigger class="flex items-center justify-between w-full shadow-none border-b-[1px] border-solid rounded-none focus:shadow-md">
                <span class="text-xl font-bold">{heading.text.slice(heading.level + 1)}</span>
                {#if collapsibleOpen}
                    <ChevronUpIcon size="12" />
                {:else}
                    <ChevronDownIcon size="12" />
                {/if}
                <span class="sr-only">Toggle</span>
            </Collapsible.Trigger>
            <Collapsible.Content>
                {#each heading.subsections as section}
                    {#if section.type === 'paragraph'}
                        <ParagraphEditor  paragraph={section} />
                    {:else if section.type === 'heading'}
                        <svelte:self class="my-2" bind:heading={section} defaultOpen={false} />
                    {/if}
                {/each}
                <AddSubheadingButton bind:heading={heading} />
            </Collapsible.Content>
        </BaseContainerRect>
    </Collapsible.Root>
{/if}
