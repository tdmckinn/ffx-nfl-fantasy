<template>
  <transition name="fade">
    <div class="nfx-modal modal" @click="close" v-show="show" :class="{ 'is-active': show }">
      <div class="modal-background"></div>
      <div class="modal-container" @click.stop>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ['show', 'onClose'],
  methods: {
    close() {
      this.onClose()
    }
  },
  mounted() {
    document.addEventListener('keydown', (e) => {
      if (this.show && e.keyCode === 27) {
        this.onClose()
      }
    })
  }
}
</script>

<style lang="scss">
.nfx-modal.nfx-modal {
  z-index: 1050;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}
</style>
