<script lang="ts">
    import { Collapsible } from "bits-ui";
    import { firstParagraph, type HeadingSection } from "../../utils/fileParser";
    import { ChevronDownIcon, ChevronUpIcon } from 'lucide-svelte'
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

    // $: if(heading){
    //     paragraph = firstParagraph(heading)?.text.trim() ?? 'No Paragraphs';
    // }

    // $: if (heading) subheadings = heading.subsections.filter(s => s.type === 'heading') as HeadingSection[];


    let newSubheadingTitle = '';
    let showSubheadingInput = false;
    $: if (!showSubheadingInput) {
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
        showSubheadingInput = false;
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
                <div contenteditable bind:innerText={paragraph} class="m-2">
                </div>
        
                {#each subheadings as subheading}
                    <svelte:self class="my-2" heading={subheading} />
                {/each}        
        
                {#if !showSubheadingInput}
                    <button class="w-full p-2 text-center" on:click={() => showSubheadingInput = true}>Add Subheading</button>
                {:else}
                    <div class="flex gap-2">
                        <input type="text" class="flex-1 p-2" bind:value={newSubheadingTitle} 
                            on:keydown={(e) => {
                                if (e.key === 'Enter') addSubheading();
                            }
                        }/>
                        <button class="p-2 text-center" on:click={addSubheading}>Add</button>
                        <button class="p-2 text-center" on:click={() => showSubheadingInput = false}>Cancel</button>
                    </div>
                {/if}
            </Collapsible.Content>
        </BaseContainerRect>
    </Collapsible.Root>
{/if}
