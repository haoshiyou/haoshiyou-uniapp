<template>
<section>
  <div class="bg-light">
    <ImagesModal v-if="modalShow" @close="closeModal" :listing="listing" :index="slide"/>
    <div class="col-9 mx-auto bg-white pb-5">
      <div class="listing-navbar">
        <!-- <nuxt-link :to="{name: 'index', params: { msg }}"><i class="fa fa-angle-left fa-3x" aria-hidden="true"></i></nuxt-link> -->
        <i class="fa fa-angle-left fa-3x" aria-hidden="true" @click="$router.back()"></i>
      </div>
      <div class="listing-body">
        <div class="listing-images">
          <div v-if="listing.imageIds">
            <b-carousel id="carousel-1" v-model="slide" controls indicators :interval="0" background="rgba(0, 0, 0, 0.5)" img-width="400" img-height="300" style="text-shadow: 1px 1px 2px #333;" @sliding-start="onSlideStart" @sliding-end="onSlideEnd">
              <b-carousel-slide v-for="(imageId, index) in listing.imageIds " v-bind:key="imageId.id" >
                <img @click="showModal"  slot="img" class="d-block img-fluid mx-auto" :src="`http://res.cloudinary.com/xinbenlv/image/upload/c_fill,g_north,w_400,h_300,g_center/${imageId}.jpg`" alt="image slot" style="touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
              </b-carousel-slide>
            </b-carousel>
          </div>
          <div v-else class="mx-auto" style="width: 400px">
            <img itemprop="image" alt="" src="/img/no-photo-placeholder.jpg" style="touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0); ">
          </div>
        </div>
        <div class="listing-title ">
          <h3 v-if="listing.title"> {{ listing.title }}</h3>
          <h3 v-else > 招租 </h3>
          <div class="text-muted">
            <i class="fa fa-clock-o" aria-hidden="true"></i>
            <span>{{ listing.updated | moment("from") }}</span>
          </div>
        </div>
        <div v-if="listing.location && listing.location.lat" class="listing-map ">
          <ListingMapView :listing="listing" />
        </div>
        <div v-if="listing.location && listing.location.city" class="listing-city text-body font-weight-bold col-12">
          {{ listing.location.city}}
        </div>
        <div class="listing-content col-12 mt-4">
          <h3>描述</h3>
          <p>{{ listing.content }}</p>
          <hr class="my-4">
          <h3>联系房东</h3>
          <div>
            <i class="fa fa-cube" aria-hidden="true"></i> 
            <span class="col-1"> 电话</span> 
            <span v-if="listing.owner && listing.owner.phone" class="col-1">{{ listing.owner.phone }}</span>
            <span v-else class="col-1">N/A</span>
          </div>
          <div>
            <i class="fa fa-cube" aria-hidden="true"></i>
            <span class="col-1"> 邮箱</span> 
            <span v-if="listing.owner && listing.owner.email" class="col-1">{{ listing.owner.email }}</span>
            <span v-else class="col-1">N/A</span>
          </div>
          <div>
            <i class="fa fa-cube" aria-hidden="true"></i>
            <span class="col-1"> 微信</span> 
            <span v-if="listing.owner && listing.owner.publicWeChatId" class="col-1">{{ listing.owner.publicWeChatId }}</span>
            <span v-else class="col-1">N/A</span>
          </div>

        </div>
        <div class="listing-price fixed-bottom text-center mx-auto col-9 bg-white border-top shadow">
          <h3 v-if="listing.price"><i class="fa fa-usd" aria-hidden="true"></i>{{ listing.price }}/月</h3>
          <h3 v-else>价格待议</h3>
        </div>
      </div>
    </div>
  </div>
</section>

</template>
<script>
import ListingMapView from "@/components/ListingMapView.vue";
import ImagesModal from "@/components/ImagesModal.vue";
import moment from "moment";

export default {
  data() {
    return {
      slide: 0,
      sliding: null,
      modalShow: false,
      msg: "test"
    };
  },
  components: {
    ListingMapView,
    ImagesModal
  },
  head() {
		return {
			title: '好室友'
		}
  },
  methods: {
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    },
    showModal() {
      this.modalShow = true;
    },
    closeModal() {
      this.modalShow = false;
    }
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
    console.log(`Returned Listing = ${params.id}`);
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
