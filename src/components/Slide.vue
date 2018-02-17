<template>
  <div class="ffx-slide">
    <div class="siema">
      <section class="siema-slide hero" v-for="item in slides" :key="item.id">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
             The Leauge
             </h1>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Siema from 'siema'

export default {
  name: 'ffx-slide',
  props: {
    slides: Array
  },
  data() {
    return {
      siema: {}
    }
  },
  mounted() {
    /* eslint-disable no-new */
    /* eslint-disable no-undef */
    this.siema = new Siema({
      duration: 500,
      perPage: 1
    })
  },
  methods: {
    nextSlide() {
      this.siema.next()
    },
    prevSlide() {
      this.siema.prev()
    }
  }
}
</script>

<style scoped lang="scss">
  .siema {
    margin: 1rem 0;
    text-align: center;
  }

  .siema-slide {
    height: 200px;
    color: white;
    font-size: 23px;

    @media(max-width: 768px) {
      height: 300px;

      .title { font-size: 1.5rem; }
    }
  }

  .hero-body {
    background-color: black;

    .title {
      color: #fff;
    }
  }
</style>
