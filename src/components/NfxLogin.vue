<template>
  <div class="nfx-login">
    <div data-netlify-identity-button>Login with Netlify Identity</div>
  </div>
</template>

<script>
import { NfxFieldset, NfxInput, NfxButton } from './'

export default {
  name: 'nfx-login'
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
