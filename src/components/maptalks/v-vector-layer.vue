<template>
  <slot v-if="ready"></slot>
</template>
<script setup>
import { VectorLayer } from '@/components/maptalks/module.js'
import { ref, inject, onBeforeUnmount, provide, watch, onMounted } from 'vue'

const props = defineProps({
  id: String,
  zIndex: Number,
  style: Object
})

const { addLayer } = inject('parentMap')
const ready = ref(false)
let tileLayer

function addGeometry(geometry) {
  tileLayer?.addGeometry(geometry)
}

function removeTileLayer() {
  if (tileLayer) {
    ready.value = false
    tileLayer.remove()
    tileLayer = null
  }
}

function createTileLayer() {
  console.log(props.id)
  console.log(props.style)
  if (props.style?.symbol) {
    tileLayer = new VectorLayer(props.id, [], {
      zIndex: props.zIndex || 10,
      style: props.style
    })
    addLayer(tileLayer)
    ready.value = true
  }
}

onMounted(() => {
  createTileLayer()
})
onBeforeUnmount(() => {
  tileLayer.remove()
})
watch(
  () => props.style,
  (newStyle) => {
    if (tileLayer) {
      tileLayer.setStyle(newStyle)
    } else {
      createTileLayer()
    }
  }
)

provide('parentVectorLayer', {
  addGeometry
})
</script>
