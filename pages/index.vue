<template>
  <div class="container">
    <div>
      <div v-for="listing in listings">
        <div>
          <div class="row border">{{listing.content}}</div>
        </div>
        <HsyListing v-bind="listing"></HsyListing>
      </div>
    </div>
  </div>
</template>

<script>
import HsyListing from '~/components/HsyListing.vue'
export default {

  components: {
    HsyListing,
  },

  async asyncData({ $axios }) {
    const listings = await $axios.$get(`/api/v1/HsyListing/list`);
    return { listings }
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
