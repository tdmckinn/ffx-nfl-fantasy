import Vue from 'vue'
import vSelect from 'vue-select'

import { NfxModal, PlayerModal, LeagueModiferModal } from './components'

// register global components
Vue.component('v-select', vSelect)
Vue.component('nfx-modal', NfxModal)
Vue.component('player-modal', PlayerModal)
Vue.component('league-modifer-modal', LeagueModiferModal)
