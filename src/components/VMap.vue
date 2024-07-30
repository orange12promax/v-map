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
  server: String
})

const mapRef = ref()
const ee = new EventEmitter()

onMounted(() => {
  updateServerUrl(props.server)
  const map = new Map('homemap', {
    center: [118.846825, 32.046534],
    zoom: 14
  })
  map.on('click', (e) => {
    ee.emit('click', e.coordinate)
  })
  console.log('load')
  mapRef.value = map
})

provide(mapName, mapRef)
provide(mapEvent, ee)
</script>
