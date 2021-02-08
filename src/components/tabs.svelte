<script lang="ts">
  export let goto: CallableFunction;
</script>

<div class="tabs">
  <div on:click={goto('/')}>Village</div>
  <div on:click={goto('/farm')}>Farm</div>
  <div on:click={goto('/workshop')}>Workshop</div>
  <div on:click={goto('/blacksmith')}>Blacksmith</div>
</div>

<style>
  .tabs {
    display: flex;
  }
  .tabs > div {
    flex: 1;
    padding: 10px;
    background-color: rgb(97,17,233);
    border: 2px solid rgb(87,109,213);
    border-top: 4px solid rgb(87,109,213);
    border-bottom: 4px solid rgb(87,109,213);
    color: white;
    font-size: 16px;
    text-align: center;
  }
  .tabs > div:hover {
    background-color: rgb(0, 0, 156);
    cursor: pointer;
  }
</style>