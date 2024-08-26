<template>
  <div class="w-full h-full relative">
    <div ref="mapElement" class="w-full h-full relative"></div>
    <slot v-if="ready"></slot>
  </div>
</template>

<script setup>
import { onMounted, provide, ref, computed, watch } from 'vue'
import { Map } from '@/components/maptalks/module'
import 'maptalks/dist/maptalks.css'
import { mapServer, mapEvent, mapMethods } from '@/components/common/config.js'
import EventEmitter from 'eventemitter3'

const props = defineProps({
  server: String,
  center: Array,
  zoom: Number
})
const emits = defineEmits(['update:center', 'update:zoom', 'moveend', 'click'])

const mapElement = ref()
const mapRef = ref()
const ee = new EventEmitter()
const mapServerUrl = computed(() => props.server)
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

provide(mapEvent, ee)
provide(mapServer, mapServerUrl)
provide(mapMethods, {
  addLayer
})
</script>
