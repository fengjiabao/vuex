<template>
  <div class="search">
    <label-input :cardType="cardType"></label-input>
    <label-input></label-input>
  </div>
</template>

<script>
import labelInput from './label-input'
export default {
  components: {
    labelInput
  },
  props: ['cardType'],
  data () {
    return {
      cardType: this.cardType
    }
  }
}
</script>
