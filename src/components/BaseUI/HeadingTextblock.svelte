<script lang="ts">
    import { Collapsible } from "bits-ui";
    import { firstParagraph, type HeadingSection } from "../../utils/fileParser";
    import { ChevronDownIcon, ChevronUpIcon, Pen } from 'lucide-svelte'
    import BaseContainerRect from "./BaseContainerRect.svelte";
    import { onMount } from "svelte";

    export let heading: HeadingSection | undefined | null = undefined;    

    export let collapsibleOpen = false;

    let paragraph: string = 'No Paragraphs';
    let subheadings: HeadingSection[] = [];

    onMount(() => {
        if(!heading) return;
        paragraph = firstParagraph(heading)?.text.trim() ?? 'No Paragraphs';
        subheadings = heading.subsections.filter(s => s.type === 'heading') as HeadingSection[];
    })


    let newSubheadingTitle = '';
    let editNewSubheadingTitle = false;
    $: if (!editNewSubheadingTitle) {
        newSubheadingTitle = '';
    }

    function addSubheading() {
        if (!heading) return;
        const newSubheading: HeadingSection = {
            type: 'heading',
            level: heading.level + 1,
            text: '#'.repeat(heading.level + 1) + ' ' + newSubheadingTitle ?? 'New Subheading',
            subsections: [{
                type: 'paragraph',
                text: 'New Paragraph'
            }]
        }
        heading.subsections = [...heading.subsections, newSubheading];
        editNewSubheadingTitle = false;
    }

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
                        {#if section.editedText}
                            <div contenteditable bind:innerText={section.editedText} class="m-2"/>
                        {:else}
                            <div class="m-2">
                                <span class="whitespace-pre-line ">{section.text}</span>
                                <div class="p-0 m-0 text-center">
                                    <button class="p-2 text-center" on:click={() => section.editedText = section.text}>
                                        <Pen size="12"/>
                                        <span class="sr-only">Edit</span>
                                    </button>
                                </div>
                            </div>
                        {/if}
                        <!-- <div contenteditable bind:innerText={section.text} class="m-2"/> -->
                    {:else if section.type === 'heading'}
                        <svelte:self class="my-2" bind:heading={section} />                        
                    {/if}
                {/each}

                <!-- Add Subheading -->
                {#if !editNewSubheadingTitle}
                    <button class="w-full p-2 text-center" on:click={() => editNewSubheadingTitle = true}>Add Subheading</button>
                {:else}
                    <div class="flex gap-2">
                        <input type="text" class="flex-1 p-2" bind:value={newSubheadingTitle} 
                            on:keydown={(e) => {
                                if (e.key === 'Enter') addSubheading();
                            }
                        }/>
                        <button class="p-2 text-center" on:click={addSubheading}>Add</button>
                        <button class="p-2 text-center" on:click={() => editNewSubheadingTitle = false}>Cancel</button>
                    </div>
                {/if}
            </Collapsible.Content>
        </BaseContainerRect>
    </Collapsible.Root>
{/if}
