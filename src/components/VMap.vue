<template>
  <div class="w-full h-full relative">
    <div id="homemap" class="w-full h-full relative"></div>
    <slot v-if="ready"></slot>
  </div>
</template>

<script setup>
import { onMounted, provide, ref, computed } from 'vue'
import { Map } from './maptalks'
import 'maptalks/dist/maptalks.css'
import { mapName, mapServer, mapEvent } from './config'
import EventEmitter from 'eventemitter3'

const props = defineProps({
  server: String,
  center: Array,
  zoom: Number
})

const mapRef = ref()
const ee = new EventEmitter()
const mapServerUrl = computed(() => props.server)
const ready = ref(false)

onMounted(() => {
  const map = new Map('homemap', {
    center: props.center,
    zoom: props.zoom
  })
  map.on('click', (e) => {
    ee.emit('click', e.coordinate)
  })
  mapRef.value = map
  ready.value = true
})

provide(mapName, mapRef)
provide(mapEvent, ee)
provide(mapServer, mapServerUrl)
</script>
