<script lang="ts">
    import {  createHeading, type HeadingSection } from "../../../utils/file/fileSections";
    let heading: HeadingSection | undefined | null = undefined;

    let newSubheadingTitle = '';
    let editNewSubheadingTitle = false;
    $: if (!editNewSubheadingTitle) {
        newSubheadingTitle = '';
    }

    function addSubheading() {
        if (!heading) return;
        const newSubheading: HeadingSection = createHeading(heading.level + 1, newSubheadingTitle ?? 'New Subheading');
        heading.subsections = [...heading.subsections, newSubheading];
        editNewSubheadingTitle = false;
    }

</script>

<!-- Add Subheading -->
{#if !editNewSubheadingTitle}
    <button class="w-full p-2 text-center" on:click={() => editNewSubheadingTitle = true}>Add Subheading</button>
{:else}
    <div class="flex gap-2">
        <input placeholder="New Subheading" type="text" class="flex-1 p-2" bind:value={newSubheadingTitle}
            on:keydown={(e) => {
                if (e.key === 'Enter') addSubheading();
            }
        }/>
        <button class="p-2 text-center" on:click={addSubheading}>Add</button>
        <button class="p-2 text-center" on:click={() => editNewSubheadingTitle = false}>Cancel</button>
    </div>
{/if}