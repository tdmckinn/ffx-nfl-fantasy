<template>
  <div> Top Drafts </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'top-drafts',
    computed: {
      ...mapState({
        players: ({ players }) => players
      })
    }
  }
</script>

<style lang="scss" scoped>
.top-drafts {
  margin-top: 50px;
}
</style>
