<template>
  <div class="nfx-league">
    <div class="nfx-league__item" v-for="league in leagues" :key="league.id">
      <div class="nfx-league__content">
        <span class="nfx-league__name">{{league.LeagueName}}</span>
        <span class="nfx-league__tag tag is-light">{{league.LeagueTeams.length}} of {{league.LeagueSettings.MaxTeams}} Members</span>
        <span class="nfx-league__tag tag is-light">Draft Start: {{league.DraftDateTime}}</span>
      </div>
        <slot name="actions" :league="league"></slot>
        <slot v-if="type === 'appLeagues'" name="settings" :league="league"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    leagues: Array,
    type: String
  }
})
</script>

<style lang="scss" scoped>
@import '../../vars';

.nfx-league {
  margin-top: 50px;

  &__item {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    border-radius: 6px;
    border: 1px solid lightgray;
    padding: 12px;
    margin-top: 25px;

    &:hover {
      border-color: $orange;
      cursor: pointer;
    }
  }

  &__content {
    // display: flex;
    // justify-content: space-between;
    // flex-wrap: wrap;
  }

  &__name {
    font-weight: bold;
  }

  &__actions {
    .button:first-child {
      margin-right: 15px;
    }
  }

  &__tag {
    margin-left: 10px;
    margin-right: 10px;
  }

  &__settings {
    width: 100%;
  }
}
</style>
