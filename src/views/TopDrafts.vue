<template>
  <div> 
    <h1 class="title">Top Drafts</h1>
    <table class="table">
      <thead>
        <tr>
          <th>
            Player
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="({ player, pos, team }, i) in playerDraftRankings" :key="i">
          <td>{{player}}</td>
          <td>{{pos}}</td>
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
        console.log(this.$store.state)
        return this.$store.state.players
      }
    },
    created() {
      this.$store.dispatch('GET_DRAFT_RANKINGS')
    }
  }
</script>

<style lang="scss" scoped>
.top-drafts {
  margin-top: 50px;
}
</style>
