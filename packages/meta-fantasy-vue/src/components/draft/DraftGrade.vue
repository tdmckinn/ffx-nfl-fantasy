<template>
  <div class="draft-grade">
    {{grade}}
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    grade: String
  }
})
</script>

<style lang="scss" scoped>
.draft-grade {
  font-size: 45px;
  color: white;
  background: #888;
  border-radius: 50%;
  width: 80px;
  line-height: 80px;
  height: 80px;
  margin: 30px auto 15px;
  font-weight: bold;
  text-align: center;
}
</style>
