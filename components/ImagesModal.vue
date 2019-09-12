<template>
  <div class="images-modal" @click="closeModal">
    <div class="modal-container">
      <b-carousel id="carousel-1" v-model="slide" controls indicators :interval="0" style="text-shadow: 1px 1px 2px #333; height:100%" @sliding-start="onSlideStart" @sliding-end="onSlideEnd">
        <b-carousel-slide v-for="imageId in listing.imageIds" v-bind:key="imageId.id">
          <img @click="show=true" slot="img" class="d-block img-fluid mx-auto" :src="`http://res.cloudinary.com/xinbenlv/image/upload/c_fill,g_north,g_center/${imageId}.jpg`" alt="image slot" style="touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);width:50%">
        </b-carousel-slide>
      </b-carousel>
      <slot />
   </div>
  </div>
</template>

<script>
export default {
  props: {
    listing: Object,
    index: Number
  },
  data() {
    return {
      slide: this.index,
      sliding: null
    };
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.images-modal {
  position: fixed;
  z-index: 9998;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);

  .modal-container {
    height: 100%;
    overflow-y: auto;
  }
}
</style>