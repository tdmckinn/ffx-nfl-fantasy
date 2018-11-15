<template functional>
  <div class="nfx-empty-state">
    <img :src="require('../assets/empty-backpack.png')" />
  </div>
</template>

<style lang="scss" scoped>
.nfx-empty-state {
  display: flex;
  justify-content: center;

  img {
    width: auto;
    height: 400px;
  }
}
</style>
