<template>
  <v-group-tile-layer :z-index="zIndex">
    <v-tile-layer
      v-for="layer in layers"
      :key="layer.layerName"
      :url-template="layer.urlTemplate"
      :subdomains="layer.subdomains"
      :z-index="layer.zIndex"
      :token="token"
    />
  </v-group-tile-layer>
</template>

<script setup>
import { computed } from 'vue'
import { getTiandituUrl, subdomains, getAnnotationByName } from './methods.js'
import VTileLayer from '../maptalks/v-tile-layer.js'
import VGroupTileLayer from '../maptalks/v-group-tile-layer.vue'

const props = defineProps({
  layer: String,
  tileMatrixSet: {
    type: String,
    default: 'w'
  },
  token: String,
  zIndex: Number,
  annotation: Boolean
})

function getUrlTemplate(layer, tileMatrixSet) {
  return getTiandituUrl({
    layer,
    tileMatrixSet
  })
}

const layers = computed(() => {
  const layerList = [props.layer]
  if (props.annotation) {
    layerList.push(getAnnotationByName(props.layer))
  }
  return layerList.map((item, index) => ({
    layerName: item,
    urlTemplate: getUrlTemplate(item, props.tileMatrixSet),
    subdomains,
    zIndex: index + 1
  }))
})
</script>
