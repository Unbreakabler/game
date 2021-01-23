<script>
  let a = 1;
  let b = 3;
  let c = 'cows'
</script>
<input type="number" bind:value={a}>
<input type="number" bind:value={b}>
<input type="text" bind:value={c}>
<p>{a} + {b} + {c} = {a + b + c}</p>