<template>
  <slot v-if="ready"></slot>
</template>
<script setup>
import { VectorLayer } from '@/components/maptalks/module.js'
import { ref, inject, onBeforeUnmount, provide, watch, onMounted } from 'vue'
import { getUuid } from '@/utils/index.js'

const props = defineProps({
  zIndex: Number,
  style: Object
})
const emits = defineEmits(['click'])

const uid = getUuid()

const { addLayer, event } = inject('parentMap')
const ready = ref(false)
let tileLayer

function addGeometry(geometry) {
  tileLayer?.addGeometry(geometry)
}

function createTileLayer() {
  tileLayer = new VectorLayer(uid, [], {
    zIndex: props.zIndex || 10,
    style: props.style
  })
  addLayer(tileLayer)
  ready.value = true
}

onMounted(() => {
  createTileLayer()
})
onBeforeUnmount(() => {
  if (tileLayer?.remove) {
    tileLayer.remove()
  }
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
        geometrys.map(({ properties }) => properties)
      )
    }
  }
})

provide('parentVectorLayer', {
  addGeometry
})
</script>
