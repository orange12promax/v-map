<template>
  <slot v-if="ready"></slot>
</template>
<script setup>
import { VectorLayer } from '@/components/maptalks/module.js'
import { ref, inject, onBeforeUnmount, onMounted, provide } from 'vue'
import { mapMethods } from '@/components/common/config.js'

const props = defineProps({
  id: String,
  options: Object
})

const { addLayer } = inject(mapMethods)
const ready = ref(false)
let tileLayer

function addGeometry(geometry) {
  tileLayer?.addGeometry(geometry)
}

onMounted(() => {
  tileLayer = new VectorLayer(props.id, [], props.options)
  addLayer(tileLayer)
  ready.value = true
})
onBeforeUnmount(() => {
  tileLayer.remove()
})
provide('parentVectorLayer', {
  addGeometry
})
</script>
