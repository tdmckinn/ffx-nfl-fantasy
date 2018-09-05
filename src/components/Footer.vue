<template>
  <footer class="nfx-footer footer">
    <div class="container">
      <div class="nfx-experimental">
        <slot></slot>
      </div>
      <div class="content has-text-centered">
        <p>
          <strong>NFX Fantasy</strong> by
          <a class="nfx-footer__user-link" href="https://tirellmckinnon.com">Tirell Mckinnon</a>
        </p>
        <p>
          <a class="icon nfx-footer__user-link" href="https://github.com/tdmckinn/nfx-nfl-fantasy">
            <i class="fa fa-github"></i>
          </a>
        </p>
        <div class="nfx-footer__disclaimer">Disclaimer: I don't own any music, video, or data related content on this site</div>
      </div>
    </div>
  </footer>
</template>

<script>
  export default {
    name: 'app-footer'
  }
</script>

<style lang="scss" scoped>
.nfx-footer {
  margin-top: 50px;
  max-height: 100px;

  &__user-link {
    color: #fab23a;
  }

  &__disclaimer {
    font-size: 8px;
  }
}
</style>
