<script lang='ts'>
  import type { Mine } from "../gamelogic/village/mine";

  export let mine: Mine;
</script>

<div>
  {mine.display_name} - {mine.current_timer_ms} - {mine.mine_timer_ms}
</div>