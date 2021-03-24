<script lang='ts'>
  /**
   * DESIGN:
   * Merging game for towers/turrets.
   * A basic grid where "turrets" spawn.
   * You can then drag identical "turrets" onto each other to merge them. You can merge with the turrets you have currently equipped in a slot to upgrade your placed turrets.
  */
  import { v4 as uuidv4 } from 'uuid';


  // Generate initial items for testing
  const item_map: { [id: string]: { id: string, type: string, tier: number }} = {};
  for (let i =0; i < 100; i++) {
    let id = uuidv4()
    item_map[id] = { id, type: 'dirt', tier: 0}
  }

  let dragging: { id: string, type: string, tier: number } | null = null;
  let over: { id: string, type: string, tier: number } | null = null;

  const dragStart = (e: DragEvent) => { 
    const element_id = e.target?.getAttribute('id')
    dragging = item_map[element_id];

  }
  const dragEnter = (e: DragEvent) => { 
    const element_id = e.target?.getAttribute('id')
    over = item_map[element_id]
    
  }

  const dragLeave = (e: DragEvent) => { 
    over = null;
  }
  const dragEnd = (e: DragEvent) => { 
    dragging = null;
    over = null;
  }

  const dragDrop = (e: DragEvent) => { 
    e.preventDefault();
    // if dragging and over are combinable, combine them.
    // add the new combined element to the item_map, remove the old items.
    if (dragging && over && dragging.type === over.type && dragging.tier === over.tier) {
      delete item_map[dragging.id]
      delete item_map[over.id]
      let id = uuidv4();
      // TODO(jon): Items should keep their order in the list, slots should s
      item_map[id] = { id, tier: dragging.tier + 1, type: dragging.type}
    }
  }

</script>

<div>
  <div class="merge-container">
    {#each Object.entries(item_map) as [id, item]}
      <div 
        id={id}
        class="item" 
        draggable=true
        on:dragstart={dragStart}
        on:dragend={dragEnd}
        on:dragenter={dragEnter}
        on:dragleave={dragLeave}
        on:drop={dragDrop}
        ondragover="return false"
      >
        <span>{item.type} - {item.tier}</span>
      </div>
    {/each}
  </div>
</div>


<style>
  .merge-container {
    user-select: none;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
    grid-auto-rows: 50px;
    gap: 20px;
  }

  .item {
    cursor: move;
    border: 1px solid red;
  }
  span {
    pointer-events: none;
  }
</style>