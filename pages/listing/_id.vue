<template>
<section>
  <div class="bg-light">
    <div class="col-10 mx-auto bg-white pb-5">
      <div class="listing-navbar">
        <nuxt-link to="/"><i class="fa fa-angle-left fa-3x" aria-hidden="true"></i></nuxt-link>
      </div>
      <div class="listing-body">
        <div class="listing-images">
          <div v-if="listing.imageIds">
            <b-carousel id="carousel-1" v-model="slide" controls indicators :interval="0" background="rgba(0, 0, 0, 0.2)" img-width="400" img-height="300" style="text-shadow: 1px 1px 2px #333;" @sliding-start="onSlideStart" @sliding-end="onSlideEnd">
              <!-- <b-carousel-slide v-for="imageId in listing.imageIds" caption="First slide" img-src="`http://res.cloudinary.com/xinbenlv/image/upload/c_fill,g_north,w_400,h_400,g_center/${imageId}.jpg`"></b-carousel-slide> -->
              <b-carousel-slide v-for="imageId in listing.imageIds" v-bind:key="imageId.id">
                <img @click="show=true" slot="img" class="d-block img-fluid mx-auto" :src="`http://res.cloudinary.com/xinbenlv/image/upload/c_fill,g_north,g_center/${imageId}.jpg`" alt="image slot" style="touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); height: 300px; width: 300px">
                <b-modal v-model="show" :hide-footer=true>
                  <img class="d-block img-fluid mx-auto" :src="`http://res.cloudinary.com/xinbenlv/image/upload/c_fill,g_north,g_center/${imageId}.jpg`" alt="img-" style="touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
                </b-modal>
              </b-carousel-slide>
            </b-carousel>
          </div>
          <div v-else class="mx-auto" style="width: 400px">
            <img itemprop="image" alt="" src="/img/no-photo-placeholder.jpg" style="touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); width: 400px; height: 300px">
          </div>
        </div>
        <div class="listing-title ">
          <h3 v-if="listing.title"> {{ listing.title }}</h3>
          <h3 v-else > 招租 </h3>
          <p class="text-muted"> {{ listing.updated | moment("from") }} </p>
        </div>
        <div v-if="listing.location" class="listing-map ">
          <ListingMapView :listing="listing" />
        </div>
        <div v-if="listing.city" class="listing-city text-body font-weight-bold col-12">
          {{ listing.city}}
        </div>
        <div class="listing-content col-12 mt-4">
          <h3>描述</h3>
          <p>{{ listing.content }}</p>
          <hr class="my-4">
          <h3>联系房东</h3>
          <div>
            <i class="fa fa-cube" aria-hidden="true"></i> 
            <span class="col-1"> 电话</span> 
            <span v-if="listing.phone" class="col-1">{{ listing.phone }}</span>
            <span v-else class="col-1">N/A</span>
          </div>
          <div>
            <i class="fa fa-cube" aria-hidden="true"></i>
            <span class="col-1"> 邮箱</span> 
            <span v-if="listing.email" class="col-1">{{ listing.email }}</span>
            <span v-else class="col-1">N/A</span>
          </div>
          <div>
            <i class="fa fa-cube" aria-hidden="true"></i>
            <span class="col-1"> 微信</span> 
            <span v-if="listing.wechat" class="col-1">{{ listing.wechat }}</span>
            <span v-else class="col-1">N/A</span>
          </div>

        </div>
        <div class="listing-price fixed-bottom text-center mx-auto col-10 bg-white border-top shadow">
          <h3 v-if="listing.price"><i class="fa fa-usd" aria-hidden="true"></i>{{ listing.price }}/月</h3>
          <h3 v-else>价格待议</h3>
        </div>
      </div>
    </div>
  </div>
</section>

</template>
<script>
import ListingMapView from "~/components/ListingMapView.vue";
import moment from "moment";

export default {
  data() {
    return {
      slide: 0,
      sliding: null,
      show: false
    };
  },
  methods: {
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    }
  },
  components: {
    ListingMapView
  },
  filters: {
    moment: function(date) {
      return moment(date).fromNow();
    }
  },
  async validate({ params, $axios }) {
    const listing = await $axios.$get(`/api/v1/HsyListing/${params.id}`);
    console.log(`Returned Listing = ${listing}`);
    return listing != null;
  },
  async asyncData({ params, $axios }) {
    const listing = await $axios.$get(`/api/v1/HsyListing/${params.id}`);
    return { listing };
  }
};
</script>
<style>
.listing-navbar {
  color: #6c6c6c;
  padding-left: 10px;
}
.listing-city {
  margin-top: -30px;
  background-color: rgba(255, 255, 255, 0.7);
  position: relative;
  height: 30px;
}
.listing-price {
  height: 50px;
}
</style>
