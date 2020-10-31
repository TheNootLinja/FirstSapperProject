<script>
  import { fade, fly, slide, scale } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { createEventDispatcher } from "svelte";
  import MeetupItem from "./MeetupItem.svelte";
  import MeetupFilter from "./MeetupFilter.svelte";
  import Button from "../UI/Button.svelte";

  export let meetups;

  const dispatch = createEventDispatcher();

  let favsOnly = false;

  $: filteredMeetups = favsOnly ? meetups.filter((m) => m.isFavorite) : meetups;

  function filterMeetup(event) {
    favsOnly = event.detail === 1;
  }
</script>

<style>
  #meetups {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }

  #meetup-controls {
    margin: 1rem;
    display: flex;
    justify-content: space-between;
  }

  #no-meetups {
    margin: 1rem;
  }

  @media (min-width: 768px) {
    #meetups {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>

{#if editMode === 'add' || editMode === 'edit'}
  <EditMeetup id={editedId} on:save={savedMeetup} on:closemodal={closeModal} />
{/if}
{#if isLoading}
  <LoadingSpinner />
{:else}
  <MeetupGrid
    meetups={$meetups}
    on:showdetails={showDetails}
    on:edit={startEdit} />
{/if}

<section id="meetup-controls">
  <MeetupFilter on:select={filterMeetup} />
  <Button on:click={() => dispatch('edit')}>New Meetup</Button>
</section>
{#if filteredMeetups.length === 0}
  <p id="no-meetups">No meetups found. Start adding some!</p>
{/if}
<section id="meetups">
  {#each filteredMeetups as meetup (meetup.id)}
    <div transition:scale animate:flip={{ duration: 450 }}>
      <MeetupItem
        id={meetup.id}
        title={meetup.title}
        subtitle={meetup.subtitle}
        description={meetup.description}
        imageUrl={meetup.image}
        email={meetup.contactEmail}
        address={meetup.address}
        isFav={meetup.isFavorite}
        on:showdetails
        on:edit />
    </div>
  {/each}
</section>
