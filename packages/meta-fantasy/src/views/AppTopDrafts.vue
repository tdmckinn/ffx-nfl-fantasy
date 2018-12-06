<template>
  <div class="nfx-top-drafts"> 
    <h1 class="title">Top Drafts</h1>
    <table class="table">
      <thead>
        <tr>
          <th>
            Player
          </th>
          <th>
            Position
          </th>
          <th>
            Team
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="({ displayName, position, team }, i) in playerDraftRankings" :key="i">
          <td>{{displayName}}</td>
          <td>{{position}}</td>
          <td>{{team}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'top-drafts',
    computed: {
      playerDraftRankings() {
        return this.$store.state.players
      }
    },
    created() {
      this.$store.dispatch('GET_DRAFT_RANKINGS')
    }
  }
</script>

<style lang="scss" scoped>
.nfx-top-drafts {
}
</style>
