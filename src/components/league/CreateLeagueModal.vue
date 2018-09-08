\<template>
  <nfx-modal :show="show" :on-close="close">
    <div class="create-league-modal modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Create New League</p>
        <button class="delete" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <p class="create-league-modal__note">* Note once you create a new league you will automatically have an associated team created. Team details can be changed later.</p>
        <form>
          <nfx-fieldset
            text="League Name"
          >
            <nfx-input v-model="leagueName.value" :isFocusOnMount="leagueName.isFocusOnMount"></nfx-input>
          </nfx-fieldset>
          <nfx-fieldset
            text="Commissioner Name"
          >
            <nfx-input v-model="commissionerName" type="text"></nfx-input>
          </nfx-fieldset>
        </form>
        <div class="nfx__divider"></div>
        <league-settings></league-settings>
      </section>
      <footer class="modal-card-foot">
        <a class="button" @click.prevent="close">Cancel</a>
        <nfx-button text="Submit" :click="createLeague" alt></nfx-button>
      </footer>
    </div>
  </nfx-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import gql from 'graphql-tag'
import { mapState } from 'vuex'

import { NfxFieldset, NfxInput, NfxButton, LeagueSettings } from '../'

export default Vue.extend({
  props: {
    show: Boolean,
    sumbit: Function
  },
  components: {
    NfxFieldset,
    NfxInput,
    NfxButton,
    LeagueSettings
  },
  data() {
    const { user } = (this.$store as any).state

    return {
      isLoading: false,
      isLeagueSaved: false,
      leagueName: {
        value: '',
        isFocusOnMount: true
      },
      commissionerName: user.firstName,
      isValidForm: true
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user
    })
  },
  methods: {
    close() {
      setTimeout(() => {
        this.isLoading = false
        this.$emit('closing')
      }, 100)
    },
    createLeague() {
      const newLeague = {
        LeagueName: this.leagueName.value,
        CommissionerName: this.commissionerName
      }

      this.$apollo
        .mutate({
          mutation: gql`
            mutation($league: CreateLeagueInput!) {
              createLeague(league: $league) {
                id
                LeagueName
              }
            }
          `,
          // Parameters
          variables: {
            league: newLeague
          }
        })
        .then(data => {
          console.log(data)
          this.isLeagueSaved = true
        })
    }
  }
})
</script>

<style lang="scss" scoped>
.create-league-modal {
  &__note {
    font-size: 10px;
    line-height: 1;
    padding-bottom: 5px;
  }

  .modal-card-foot {
    display: flex;
    justify-content: space-between;
  }
}

@media (max-width: 768px) {
  .modal-card {
    margin: 0;
  }
}
</style>
