<template>
  <nfx-modal :show="show" :on-close="close">
    <div class="league-modifer-modal modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{modalTitle}}</p>
        <button class="delete" @click="close"></button>
      </header>
      <section class="modal-card-body">
        <p class="league-modifer-modal__note">* Note once you create a new league you will automatically have an associated team created. Team details can be changed later.</p>
        <form>
          <div v-if="!isSettingsEditMode">
            <nfx-fieldset
              text="League Name"
            >
              <nfx-input v-model="leagueName.value" placeholder="League Name Here" :isFocusOnMount="leagueName.isFocusOnMount"></nfx-input>
            </nfx-fieldset>
            <nfx-fieldset
              text="Commissioner Name"
            >
              <nfx-input v-model="commissionerName" type="text"></nfx-input>
            </nfx-fieldset>
            <nfx-fieldset
              text="Draft Date / Time"
            >
              <nfx-input ref="dateTimerPicker" id="leagueModiferDraftDateTimer" v-model="draftDateTime" type="text" placeholder="Date Here"></nfx-input>
            </nfx-fieldset>
            <div class="nfx__divider"></div>
          </div>
          <div v-if="isSettingsEditMode">
            <h5 class="title is-5">Team <span v-if="teamID">{{teamID}}</span></h5>
            <nfx-fieldset
              text="Team Name"
            >
              <nfx-input v-model="teamName" placeholder="Team Name Here"></nfx-input>
            </nfx-fieldset>
            <div class="nfx__divider"></div>
            <league-settings :defaultSettingsConfig="settings" :leagueSettings="leagueSettings"></league-settings>
          </div>
        </form>
      </section>
      <footer class="modal-card-foot">
        <a class="button" @click.prevent="close">Cancel</a>
        <nfx-button v-if="isSettingsEditMode" text="Save" :click="updateLeague" alt></nfx-button>
        <nfx-button v-if="!isSettingsEditMode" text="Submit" :click="createLeague" alt></nfx-button>
      </footer>
    </div>
  </nfx-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { format } from 'date-fns/esm'
import gql from 'graphql-tag'
import flatpickr from 'flatpickr'

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
      isSettingsEditMode: false,
      leagueSettings: {},
      settings: [],
      leagueName: {
        value: '',
        isFocusOnMount: true
      },
      teamID: '',
      draftDateTime: '',
      teamName: '',
      commissionerName: user.firstName,
      isValidForm: true
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user
    }),
    modalTitle() {
      return (this as any).isSettingsEditMode
        ? `Edit League Settings - ${(this as any).leagueName.value}`
        : 'Create New League'
    }
  },
  apollo: {
    settings: gql`
      {
        settings {
          id
          type
          text
          value
          values {
            id
            value
          }
          singleValues
          readOnly
        }
      }
    `
  },
  mounted() {
    this.$nextTick(() => {
      const datePickerEl = document.querySelector(
        '#leagueModiferDraftDateTimer input'
      ) as HTMLElement

      return datePickerEl
        ? flatpickr(datePickerEl, {
            dateFormat: 'M d, Y H:i',
            enableTime: true
          })
        : null
    })
  },
  methods: {
    close() {
      // Object.assign(this.$data, this.$options.data())
      setTimeout(() => {
        this.$emit('closing')
      }, 100)
    },
    saveLeagueSettings() {
      if (Object.keys(this.leagueSettings).length === 0) {
        alert('Must set league settings')
        return false
      }
    },
    createLeague() {
      /**
       * TODO: Validations
       */
      const newLeague = {
        LeagueName: this.leagueName.value,
        CommissionerName: this.commissionerName,
        DraftDateTime: format(new Date(this.draftDateTime), 'YYYY-MM-dd HH:mm')
      }

      this.$apollo
        .mutate({
          mutation: gql`
            mutation($league: CreateLeagueInput!) {
              createLeague(league: $league) {
                id
                CommissionerID
                LeagueTeams {
                  id
                  OwnerID
                  Name
                }
                CommissionerID
                LeagueName
                LeagueSettings {
                  id
                  LeagueID
                }
              }
            }
          `,
          // Parameters
          variables: {
            league: newLeague
          }
        })
        .then(({ data: { createLeague } }: any) => {
          alert('League saved continue editing...')
          this.teamID = createLeague.LeagueTeams.find(
            team => team.OwnerID === createLeague.CommissionerID
          ).id
          this.isSettingsEditMode = true
        })
    },
    updateLeague() {
      const readonlySettings = this.settings
        .filter(({ readOnly }: any) => readOnly)
        .map(({ id, value, values, singleValues }: any) => {
          return { [id]: value || values || singleValues }
        })
        .reduce((val, nextSetting) => {
          const setting = Object.entries(nextSetting)[0]
          val[setting[0]] = setting[1]
          return val
        }, {})

      const updatedSettings = {
        ...this.leagueSettings,
        ...readonlySettings
      }
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($settings: UpdateLeagueSettingsInput!) {
              updateLeagueSettings(settings: $settings) {
                id
              }
            }
          `,
          // Parameters
          variables: {
            settings: updatedSettings
          }
        })
        .then(data => {
          console.log(data)
        })
    }
  }
})
</script>

<style lang="scss" scoped>
.league-modifer-modal {
  &__note {
    font-size: 10px;
    line-height: 1;
    padding-bottom: 5px;
  }

  .nfx__divider {
    padding: 10px;
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
