<template>
<section>
  <div>
    {{ $route.params.id }}
  </div>
  <div>
    {{ listing }}
  </div>
</section>

</template>
<script>
  export default {
    async validate ({ params, $axios }) {
      const listing = await $axios.$get(`/api/v1/HsyListing/${params.id}`);
      console.log(`Returned Listing = ${listing}`);
      return listing != null;
    },
    async asyncData({ params, $axios }) {
      const listing = await $axios.$get(`/api/v1/HsyListing/${params.id}`);
      return { listing }
    },
  }
</script>
<style></style>
