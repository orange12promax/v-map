<template>
  <slot v-if="ready"></slot>
</template>

<script setup>
import { GroupTileLayer } from '@/components/maptalks/module.js'
import { ref, inject, onBeforeUnmount, provide, watch, onMounted } from 'vue'
import { getUuid } from '@/utils'

const props = defineProps({
  zIndex: Number
})

const uid = getUuid()
const { addLayer } = inject('parentMap')
const ready = ref(false)
let groupTileLayer

function addChildLayer(layers) {
  groupTileLayer?.addLayer(layers)
}
function removeChildLayer(layers) {
  groupTileLayer?.removeLayer(layers)
}

function createGroupTileLayer() {
  groupTileLayer = new GroupTileLayer(uid, [], {
    zIndex: props.zIndex || 1,
    style: props.style
  })
  addLayer(groupTileLayer)
  ready.value = true
}

onMounted(() => {
  createGroupTileLayer()
})
onBeforeUnmount(() => {
  if (groupTileLayer?.remove) {
    groupTileLayer.remove()
  }
})

provide('parentGroupTileLayer', {
  addChildLayer,
  removeChildLayer
})
</script>
