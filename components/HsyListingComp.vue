<template>
    <div class="wrapper" itemscope itemtype="https://schema.org/Room" v-on:click="$router.push(`/listing/${listing._id}`)">
        <div class="grid-container">
            <div class="content">
                <div itemprop="name" class="hsy-title">{{ listing.title || "招租" }}</div>
                <div class="hsy-middle">
                    <template v-if="listing.location && listing.location.city"><i class="fa fa-clock-o" aria-hidden="true"></i> <span itemprop="geo" class="location"> {{ listing.location.city }}</span></template>
                    <i class="fa fa-map-marker" aria-hidden="true"></i> <span>{{ listing.updated | moment("from") }}</span>
                </div>
                <div class="hsy-price flex">
                    <!----><!---->
                    <template  v-if="listing.price"><span class="price-dollar-number-per">{{ listing.price }}</span><span class="month">/月</span></template>
                    <span v-if="!listing.price" class="price-dollar-number-per">价格待议</span>
                    <!---->
                </div>
            </div>
            <div class="thumbnail">
                <template v-if="listing.imageIds">
                    <img :src="`http://res.cloudinary.com/xinbenlv/image/upload/c_fill,g_north,w_400,h_300,g_center/${listing.imageIds[0]}.jpg`" alt="img-" style="touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
                </template>
                <img v-if="!listing.imageIds" itemprop="image" alt="" src="/img/no-photo-placeholder.jpg"
                     style="touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
            </div>
            <a itemscope itemprop="identifier" :href="`/listing/${listing._id}`"></a>
        </div>
    </div>
</template>
<script>
  import moment from 'moment';
  export default {
  props: {
    listing: Object
  },
  filters: {
    moment: function (date) {
      return moment(date).fromNow();
    }
  },
}
</script>
<style>
.grid-container {
    display: grid;
    grid-template-columns: 1fr 128px;
}
.hsy-title {
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-height: 24px;
    max-height: 3em;
    font-size: 16px;
    color: #4d4d4d;
    margin-bottom: .5em;
    word-wrap: break-word;
}
.hsy-middle {
    font-size: 12px;
    color: #6c6c6c;
    line-height: .75em;
    margin-bottom: .25em;
}
.hsy-price {
  color:  #21b3fe;
}
.hsy-price > .price-dollar-number-per{
    font-weight: 500;
    line-height: 1.5em;
}
.hsy-price > month {
    font-size: .75em;
}
.wrapper {
    margin: 0 12px;
}

.thumbnail {
    display:block;
}
.grid-container {
    padding: 12px 0px;
    border-bottom: #e1e1e1 solid 1px;
}
img {
    max-width: 100%;
    border: #e1e1e1 solid 1px;
}
.location {
    margin-right: 12px;
}
</style>
