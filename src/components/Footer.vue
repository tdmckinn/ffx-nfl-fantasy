<template>
  <footer class="ffx-footer footer">
    <div class="container">
      <div class="content has-text-centered">
        <p>
          <strong>NFX Fantasy</strong> by
          <a class="ffx-footer__user-link" href="https://tirellmckinnon.com">Tirell Mckinnon</a>
        </p>
        <p>
          <a class="icon ffx-footer__user-link" href="https://github.com/tdmckinn/ffx-nfl-fantasy">
            <i class="fa fa-github"></i>
          </a>
        </p>
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
.ffx-footer {
  &__user-link {
    color: #fab23a;
  } 
}
</style>
