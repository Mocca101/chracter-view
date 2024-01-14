<script lang="ts">
    import { Collapsible } from "bits-ui";
    import { firstParagraph, type HeadingSection } from "../../utils/fileParser";
    import { ChevronDownIcon, ChevronUpIcon } from 'lucide-svelte'
    import BaseContainerRect from "./BaseContainerRect.svelte";


    export let heading: HeadingSection;

    $: paragraph = firstParagraph(heading)?.text ?? 'No Paragraphs';
    // "Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit."
    // + "\n\n"
    // + "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor."
    // + "\nCras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.";

    let collapsibleOpen = false;

    $: subheadings = heading.subsections.filter(s => s.type === 'heading') as HeadingSection[];

    $: console.log(subheadings);
    

    function addSubheading(title: string) {
        const newSubheading: HeadingSection = {
            type: 'heading',
            level: heading.level + 1,
            text: '#'.repeat(heading.level + 1) + ' ' + title ?? 'New Subheading',
            subsections: [{
                type: 'paragraph',
                text: 'New Paragraph'
            }]
        }
        heading.subsections = [...heading.subsections, newSubheading];
    }
</script>

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
            <div class="m-2">
                {paragraph}
            </div>
    
            {#each subheadings as subheading}
                <svelte:self class="my-2" heading={subheading} />
            {/each}        
    
            <button class="w-full p-2 text-center" on:click={() => addSubheading('New Subheading')}>Add Subheading</button>
        </Collapsible.Content>
    </BaseContainerRect>
</Collapsible.Root>