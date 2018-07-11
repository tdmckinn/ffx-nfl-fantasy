<template>
  <div class="ffx-login">
    <form>
      <ffx-fieldset
        text="Email"
        help-text="Enter your email"
        >
        <ffx-input v-model="email.value" :isFocusOnMount="email.isFocusOnMount"></ffx-input>
      </ffx-fieldset>
      <ffx-fieldset
        text="Password"
        help-text="Enter your password">
        <ffx-input v-model="password" type="password"></ffx-input>
      </ffx-fieldset>
      <ffx-button text="Login" :click="login"></ffx-button>
    </form>
  </div>
</template>

<script>
import FfxFieldset from './Fieldset.vue'
import FfxInput from './Input.vue'
import FfxButton from './Button.vue'

export default {
  name: 'ffx-login',
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
  components: {
    FfxFieldset,
    FfxInput,
    FfxButton
  },
  methods: {
    login() {
      this.$store.dispatch('AUTHENTICATE_USER', { email: this.email.value, password: this.password })
    }
  }
}
</script>

<style lang="scss" scoped>
  .ffx-login {
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
