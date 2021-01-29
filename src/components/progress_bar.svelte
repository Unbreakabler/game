<script>
  export let total = 100;
  export let current = 0;

  $: progress_width = (current/total) * 100 + '%'
</script>

<style>
  .container {
    height: 20px;
    width: 100%;
    background-color: red;
  }
  .progress {
    background-color: blue;
    width: var(--progress_width);
    height: 20px;
  }
</style>

<div class="container" style="--progress_width: {progress_width}">
  <div class="progress"></div>
</div>