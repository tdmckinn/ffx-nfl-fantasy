<template>
  <div class="nfx-draft__order">
    <h3>Draft Order</h3>
    <aside v-if="teams" class="menu">
      <div v-for="(team, index) in teams" :key="team.id">
        <p class="menu-label">
          Round {{index + 1}}
        </p>
        <ul class="menu-list">
          <li><span>1</span><span>Peter's Team</span></li>
          <li><span>1</span><span>Peter's Team</span></li>
          <li><span>1</span><span>Peter's Team</span></li>
          <li><span>1</span><span>Peter's Team</span></li>
          <li><span>1</span><span>Peter's Team</span></li>
          <li><span>1</span><span>Peter's Team</span></li>
          <li><span>1</span><span>Peter's Team</span></li>
          <li><span>1</span><span>Peter's Team</span></li>
          <li><span>1</span><span>Peter's Team</span></li>
          <li><span>1</span><span>Peter's Team</span></li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: ['teams']
})
</script>

<style lang="scss" scoped>
.nfx-draft__order {
  max-height: 250px;
  overflow: scroll;
}
</style>
