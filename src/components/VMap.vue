<template>
  <div class="w-full h-full relative">
    <div id="homemap" class="w-full h-full relative"></div>
    <slot></slot>
  </div>
</template>

<script setup>
import { onMounted, provide, ref } from 'vue'
import { Map } from './maptalks'
import 'maptalks/dist/maptalks.css'
import { mapName, mapEvent } from './config'
import { updateServerUrl } from '../services/common'
import EventEmitter from 'eventemitter3'

const props = defineProps({
  server: String,
  center: Array,
  zoom: Number
})

const mapRef = ref()
const ee = new EventEmitter()

onMounted(() => {
  updateServerUrl(props.server)
  const map = new Map('homemap', {
    center: props.center,
    zoom: props.zoom
  })
  map.on('click', (e) => {
    ee.emit('click', e.coordinate)
  })
  mapRef.value = map
})

provide(mapName, mapRef)
provide(mapEvent, ee)
</script>
