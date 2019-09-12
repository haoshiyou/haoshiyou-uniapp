<template>
  <section>
    
    <GMap id="hsy_mapview"
        :cluster="{options: {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'}}"
        :center="{lat: listing.location.lat, lng: listing.location.lng}"
        :options="{fullscreenControl: false, streetViewControl: false, mapTypeControl: false, zoomControl: true, gestureHandling: 'greedy', styles: mapStyle}"
        :zoom="13">
      <GMapMarker :position="{lat: listing.location.lat, lng: listing.location.lng}"
                  :options="{ icon: Icon, label: Label}"
                  @click="currentLocation = listing.location">
        <GMapInfoWindow>
          <code v-if="listing.location.fullAddr">
            {{ listing.location.fullAddr }}
          </code>
          <code v-else-if="listing.location.zipcode">
            {{ listing.location.zipcode }}
          </code>
          <code v-else>
            {{ listing.location.city }}
          </code>
        </GMapInfoWindow>
      </GMapMarker>
    </GMap>
  </section>
</template>

<script>
export default {
  props: {
    listing: Object
  },
  data() {
    return {
      Label: {
        text: "$" + this.listing.price.toString(),
        fontFamily: "Impact, fantasy",
        fontSize: "14px",
        color: "#000000",
        fontWeight: "800"
      },
      Icon: {
        labelOrigin: { x: 25, y: 25 },
        scaledSize: { width: 50, height: 50 },
        url:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAG7AAABuwE67OPiAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAYZQTFRF/////wCA/1VV/0BA/zMz/0lJ4zk55jNN6zs77TdJ7jNE70BA8Dw86TdD6jVA7TdA7TU+7zpC7DlA8DZA7DlC7DhB7TdA7jdA7zhA7zc/7Tc/7jg/7zdB7ThB7ThA7jdA7zc/7zlB7zc/7jlA7jhA7zg/7zlA7TdA7jhB7zhA7Tc/7TlB7jhA7jg/7zhA7jhA7jhA7jk/7zhA7zc/7ThB7jlB7jdB7jhA7jg/7jhA7jhA7jhA7jhA7jc/7jlA7jg/7jhA7jhA7jlA7jdA7zg/7jg/7jhA7jhA7jhA7jg/7jdA7jg/7jhA7jhA7jg/7jhA7jg/7jhA7jhA7jhA7jhA7jlB7jtD7z1F70BH70JJ70RL70VM70ZM8ElP8Vdc8Vld8ltf8lxg8mBk8mJm82dq825w9G9x9HFz9HZ39Xl69YKB9oaF9oqJ946M94+N95aU+JuY+J2Z+J+b+aWh+qyn+7u0/L+3/MK6/Me//crB/c7G/dDH/tPK/trQ/93S/97U/+DV/+HWi9+UUAAAAFR0Uk5TAAIDBAUHCQoNDg8QERcYHB0fKDQ2Nzg8QEFFSU9WV1hdXmFnaG1wc3p8gYKIiYyTl5mcnZ6iprO1tre/wMHCxczO1NjZ4err7O3v8fP09fj5+/z+MxvIQwAAAnBJREFUGBmdwQk7VFEABuBvGFtkJ5LIlpCSNSVbM/bl5ssaTUVly1Ip+5x/nsfT455z7zl3znhfGGU9bO169XZy8u3rrtaHWUhSbm3vLCWzvbW5sJf73KGP8zwXdjKbp6g11ZwJC/ejNIreR0L17xjgXT2ChduYQFsYAVJeMqGXKTB7RgvPYFRLK7UwKHdoxSmHVlqEliJp0HlMr9XN3cPD3c1Vej2GRvYYVZ9/x8W1+O/PVI1lw6+FioW9uLgR31ugogU+GdOUfforFH8/UTadAa8HlK1dCI+LNcoewKuDkvk/wufPPCUd8AhFKfkhNH5QEg1BdY+S2KXQuIxRcg+qOkp+Ca1flNRB1UzXwrnQOl+gqxmqF3R9EQZf6HoBVQ9d34XBd7p6oBqka1sYbNM1CNUburaEwRZdb6DqpOubMPhGVydUTXR9FAYf6WqCqoau96dC6/Q9XTVQlVGyL7T2KSmDqoCSD2dC4+wDJQVQpTiUfBUaXylxUuAxQNlP4fOTsgF4NVC2fCw8jpcpa4DXXYeyxQOhOFikzLkLnx6q1k/EjZN1qnrgV0WPpZ2juLgSP9pZokcV/NIn6LMS29iIrdBnIh0a7bTWDp2iOVqaK4JWFy11Qa9ghlZmCmDwlFaewuTOCC2M3IFRPS3Uwyw8zISGwwhQ7DABpxiBGplAI4KF+hioL4QE8scZYDwfCVUyQCUstNGoDTZSu2nQnQor6f3U6k+HpZwhagzlwFpehD6RPCShcJQeo4VISuk0FdOlSFKFQ4lTgaRVz/HGXDVu4ZHD/5xHuJWKKV6bqsAtlYzwykgJbi3/ydDQk3wE+Qe8yj6NIv6VcwAAAABJRU5ErkJggg=="
      },
      pins: {
        selected:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAApVBMVEUAAAD/AAD/AADxHCvyGyjzGDHoFy7vGSnwHi3wHSzsGi3uGivuHivrGyvsHCztGyrtHSzuHCvuHSzsHSzsHSvtHCvtHCrtGyvsHCvsHCvtHSztHCvtHCvtHCvuGyvtHCvtHSztGyvtHSvtHCvtHCztHCvsHCvtHCvtHCvtHCvtHCvtHCvtHCvtHCvtHCvtHCvtHCvtHCvtHCvtHCvtHCvtHCv///8Zo6fZAAAANXRSTlMAAQISExUWHyIjKDs8QVJVV1ppe3x+f4KHiJiZmpuxt7vDxMbHys7R4Ont7u/w8fLz9Pb7/qzXrqoAAAABYktHRDZHv4jRAAAAn0lEQVQYGaXBV5KCQABF0eeooxjGnDFnpc13/1uzi7JoQL/Gc/R/v931fr/u5JXSuBK61JVQe/Dy+FNM/kQkyMnpYRnfN1hdOVsgKEqeATZyzsBI1hg4yTkCQ1kj4CBnBQRFyTPAUs4Ay/i+werLKRFTUsyCyFxxFSJlJcx4mSnJuxG6FpTSJtRS2s8Ua5LRm+wOdll9UL3fq/qo2dQ3nvcVIgrnmsRBAAAAAElFTkSuQmCC",
        notSelected:
          "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABHElEQVR42uVVyw4BMRQdC98lsbPwG5YSH+BzWFtLZilh0oQgFh6J54IwBmGYtrfaBREdcTvDhpM0adrec3rb+7Csn8fRdrLg7VzBubhDzmHrudRuZ2KRs/miLd6AThfNaOTTGRFIsMm8bkSuXBeGoLVaGi0g39wLI4GTf1EjdE/+E1pAAGgEAenkb/tBo1vQFUDgBbSbny6al77uSQwB/6wJSNHoAo8xj30iaYMW4Lv9wfSTpc0eH6atXtE4TKWNUS4AY2hyddY4k/lwVEZncm9QilQuBGPwnp1B5GIXGi3P0eU0c7EqKrje5hU5d7fr2P2AEJIESkNqB1XJkvhI0/GrTuqZX619tLMF/VHlfnk5/0r7ZMvVWA3rr3AF6LIMZ7PmSlUAAAAASUVORK5CYII="
      },
      clusterStyle: [
        {
          url: "https://googlemaps.github.io/js-marker-clusterer/images/m2.png",
          width: 56,
          height: 56,
          textColor: "#fff"
        }
      ],
      mapStyle: [
        {
          featureType: "all",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#ffffff"
            }
          ]
        },
        {
          featureType: "all",
          elementType: "labels.text.stroke",
          stylers: [
            {
              visibility: "on"
            },
            {
              color: "#3e606f"
            },
            {
              weight: 2
            },
            {
              gamma: 0.84
            }
          ]
        },
        {
          featureType: "all",
          elementType: "labels.icon",
          stylers: [
            {
              visibility: "off"
            }
          ]
        },
        {
          featureType: "administrative",
          elementType: "geometry",
          stylers: [
            {
              weight: 0.6
            },
            {
              color: "#313536"
            }
          ]
        },
        {
          featureType: "landscape",
          elementType: "geometry",
          stylers: [
            {
              color: "#44a688"
            }
          ]
        },
        {
          featureType: "poi",
          elementType: "geometry",
          stylers: [
            {
              color: "#13876c"
            }
          ]
        },
        {
          featureType: "poi.attraction",
          elementType: "geometry.stroke",
          stylers: [
            {
              color: "#f5e4e4"
            },
            {
              visibility: "off"
            }
          ]
        },
        {
          featureType: "poi.attraction",
          elementType: "labels",
          stylers: [
            {
              visibility: "on"
            },
            {
              lightness: "14"
            }
          ]
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [
            {
              color: "#13876c"
            },
            {
              visibility: "simplified"
            }
          ]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [
            {
              color: "#067372"
            },
            {
              lightness: "-20"
            }
          ]
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [
            {
              color: "#357374"
            }
          ]
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [
            {
              color: "#004757"
            }
          ]
        }
      ],
      currentLocation: {}
    };
  }
};
</script>

<style lang="scss" scoped>
</style>