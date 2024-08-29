<template>
  <div class="w-full h-full relative">
    <div ref="mapElement" class="w-full h-full relative"></div>
    <slot v-if="ready"></slot>
  </div>
</template>

<script setup>
import { onMounted, provide, ref, computed, defineExpose } from 'vue'
import { Map } from '@/components/maptalks/module'
import 'maptalks/dist/maptalks.css'
import EventEmitter from 'eventemitter3'

const props = defineProps({
  server: String,
  center: Array,
  zoom: Number
})
const emits = defineEmits(['update:center', 'update:zoom', 'moveend', 'click'])

const mapElement = ref()
const mapRef = ref()
const event = new EventEmitter()
const serverUrl = computed(() => props.server)
const ready = ref(false)

let map

function addLayer(layer) {
  return map?.addLayer(layer)
}

onMounted(() => {
  map = new Map(mapElement.value, {
    center: props.center,
    zoom: props.zoom
  })
  map.on('click', (e) => {
    const { coordinate } = e
    event.emit('click', coordinate)
    emits('click', {
      coordinate: [coordinate.x, coordinate.y]
    })
  })
  map.on('moveend', (e) => {
    const { coordinate } = e
    emits('update:center', [coordinate.x, coordinate.y])
  })
  mapRef.value = map
  ready.value = true
})

function setCenter(center) {
  map?.setCenter(center)
}
function setZoom(zoom) {
  map?.setZoom(zoom)
}

provide('parentMap', {
  event,
  serverUrl,
  addLayer
})
defineExpose({
  setCenter,
  setZoom
})
</script>
