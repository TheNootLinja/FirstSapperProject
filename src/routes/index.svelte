<script context="module">
  // To preload our data we have create and export a function called preload
  // in this kind of outsite script with the context of module.
  export function preload(page) {
    // Need to remember that in the module context script we have to use this.fetch
    // instead of just fetch.
    return (
      this.fetch('https://svelte-course-e7a24.firebaseio.com/meetups.json')
        // In the first then block we are checking if the response is
        // in the 200 range and if not throwing a new error.
        .then((res) => {
          if (!res.ok) {
            throw new Error('An error has occured, please try again.');
          }
          // If we make it past the res.ok check then we return the
          // response parsed as json
          return res.json();
        })
        // After returning the response we have our data in a
        // rough form.
        .then((data) => {
          const fetchedMeetups = [];
          for (const key in data) {
            fetchedMeetups.push({
              ...data[key],
              id: key,
            });
          }
          return { fetchedMeetups: fetchedMeetups.reverse() };
        })
        .catch((err) => {
          console.log(err);
          isLoading = false;
          error = err;
          this.error(500, 'Could not fetch meetups!');
        })
    );
  }
</script>

<script>
  import { fade, fly, slide, scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import meetups from '../meetups-store';
  import MeetupItem from '../components/Meetup/MeetupItem.svelte';
  import MeetupFilter from '../components/Meetup/MeetupFilter.svelte';
  import Button from '../components/UI/Button.svelte';
  import EditMeetup from '../components/Meetup/EditMeetup.svelte';
  import LoadingSpinner from '../components/UI/LoadingSpinner.svelte';

  export let fetchedMeetups;

  let editMode;
  let editedId;
  let isLoading;
  let unsubscribe;

  const dispatch = createEventDispatcher();

  let favsOnly = false;

  $: filteredMeetups = favsOnly
    ? fetchedMeetups.filter((m) => m.isFavorite)
    : fetchedMeetups;

  onMount(() => {
    meetups.setMeetups(fetchedMeetups);
    unsubscribe = meetups.subscribe((items) => {
      fetchedMeetups = items;
    });
  });

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  function filterMeetup(event) {
    favsOnly = event.detail === 1;
  }

  function savedMeetup() {
    editMode = null;
    editedId = null;
  }

  function closeModal() {
    editMode = null;
    editedId = null;
  }

  function startEdit(event) {
    editMode = 'edit';
    editedId = event.detail;
  }

  function startAdd() {
    editMode = 'edit';
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

<svelte:head>
  <title>Meetups</title>
</svelte:head>

{#if editMode === 'add' || editMode === 'edit'}
  <EditMeetup id={editedId} on:save={savedMeetup} on:closemodal={closeModal} />
{/if}
{#if isLoading}
  <LoadingSpinner />
{:else}
  <section id="meetup-controls">
    <MeetupFilter on:select={filterMeetup} />
    <Button on:click={startAdd}>New Meetup</Button>
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
          on:edit={startEdit} />
      </div>
    {/each}
  </section>
{/if}
