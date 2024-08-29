<template>
  <slot v-if="ready"></slot>
</template>
<script setup>
import { VectorLayer } from '@/components/maptalks/module.js'
import { ref, inject, onBeforeUnmount, onMounted, provide, watch } from 'vue'

const props = defineProps({
  id: String,
  options: Object
})

const { addLayer } = inject('parentMap')
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

watch(
  () => props.options,
  () => {
    if (tileLayer) {
      tileLayer.setOptions(props.options)
    }
  }
)

provide('parentVectorLayer', {
  addGeometry
})
</script>
