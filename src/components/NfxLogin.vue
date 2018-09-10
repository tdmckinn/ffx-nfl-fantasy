<template>
  <div class="nfx-login">
    <form>
      <nfx-fieldset
        text="Email"
        help-text="Enter your email"
        >
        <nfx-input v-model="email.value" :isFocusOnMount="email.isFocusOnMount"></nfx-input>
      </nfx-fieldset>
      <nfx-fieldset
        text="Password"
        help-text="Enter your password">
        <nfx-input v-model="password" type="password"></nfx-input>
      </nfx-fieldset>
      <nfx-button text="Login" :click="login"></nfx-button>
    </form>
  </div>
</template>

<script>
import { NfxFieldset, NfxInput, NfxButton } from './'

export default {
  name: 'nfx-login',
  components: {
    NfxFieldset,
    NfxInput,
    NfxButton
  },
  data() {
    return {
      email: {
        value: '',
        isFocusOnMount: true
      },
      password: '',
      isValidForm: true
    }
  },
  methods: {
    login() {
      this.$store.dispatch('AUTHENTICATE_USER', { email: this.email.value, password: this.password })
    }
  }
}
</script>

<style lang="scss" scoped>
  .nfx-login {
    display: flex;
    min-height: calc(100vh - 75px);
    align-items: center;

    form {
      display: block;
      margin: 0 auto;
      text-align: center;
      width: 480px
    }

    @media (max-width: 768px) {
      padding-left: 25px;
      padding-right: 25px;
    }
  }
</style>
