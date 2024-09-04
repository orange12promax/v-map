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
const emits = defineEmits(['click'])

const { addLayer, event } = inject('parentMap')
const ready = ref(false)
let tileLayer

function addGeometry(geometry) {
  tileLayer?.addGeometry(geometry)
}

function createTileLayer() {
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

event.on('click', (coor) => {
  if (tileLayer) {
    const geometrys = tileLayer.identify(coor)
    if (geometrys instanceof Array && geometrys.length > 0) {
      emits(
        'click',
        geometrys.map((item) => ({
          layer: props.id,
          properties: item.properties
        }))
      )
    }
  }
})

provide('parentVectorLayer', {
  addGeometry
})
</script>
