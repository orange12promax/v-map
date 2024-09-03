<template>
  <slot v-if="ready"></slot>
</template>
<script setup>
import { VectorLayer } from '@/components/maptalks/module.js'
import { ref, inject, onBeforeUnmount, onMounted, provide, watch, toRefs, watchEffect } from 'vue'

const props = defineProps({
  id: String,
  options: Object
})
const { id, options } = toRefs(props)

const { addLayer } = inject('parentMap')
const ready = ref(false)
let tileLayer

function addGeometry(geometry) {
  tileLayer?.addGeometry(geometry)
}

watchEffect(() => {
  if (id.value && options.value) {
    tileLayer = new VectorLayer(id.value, [], options.value)
    addLayer(tileLayer)
    ready.value = true
  }
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
