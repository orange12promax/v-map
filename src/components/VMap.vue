<template>
  <div class="w-full h-full relative">
    <div id="homemap" class="w-full h-full relative"></div>
    <slot v-if="ready"></slot>
  </div>
</template>

<script setup>
import { onMounted, provide, ref, computed, watch } from 'vue'
import { Map } from './maptalks'
import 'maptalks/dist/maptalks.css'
import { mapName, mapServer, mapEvent, mapMethods } from './config'
import EventEmitter from 'eventemitter3'

const props = defineProps({
  server: String,
  center: Array,
  zoom: Number
})
const emits = defineEmits(['update:center', 'update:zoom', 'moveend', 'click'])

const mapRef = ref()
const ee = new EventEmitter()
const mapServerUrl = computed(() => props.server)
const ready = ref(false)

let map

function addLayer(layer) {
  return map?.addLayer(layer)
}

onMounted(() => {
  map = new Map('homemap', {
    center: props.center,
    zoom: props.zoom
  })
  map.on('click', (e) => {
    const { coordinate } = e
    ee.emit('click', coordinate)
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

watch(
  () => props.center,
  (nv) => {
    map?.setCenter(nv)
  }
)

provide(mapName, mapRef)
provide(mapEvent, ee)
provide(mapServer, mapServerUrl)
provide(mapMethods, {
  addLayer
})
</script>
