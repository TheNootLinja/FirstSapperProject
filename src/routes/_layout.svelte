<script>
  import Header from "../components/UI/header.svelte";

  export let segment;
</script>

<style>
  main {
    margin-top: 5rem;
  }
</style>

<Header />

<main>
  <slot />
</main>
