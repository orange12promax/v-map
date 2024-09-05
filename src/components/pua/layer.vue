<template>
  <v-vector-layer :id="id" :style="style" @click="handleItemClick">
    <v-pua-item
      v-for="ft in simpleFeatures"
      :key="ft.id"
      :type="dataType"
      :id="ft.id"
      :coordinates="ft.coordinates"
      :options="ft.options"
    />
  </v-vector-layer>
</template>

<script>
export default {
  name: 'VPuaLayer'
}
</script>

<script setup>
import VVectorLayer from '../maptalks/v-vector-layer.vue'
import { usePubVtLayer } from '@/components/pub/vt.js'
import { computed, onMounted } from 'vue'
import VPuaItem from './item.jsx'

const props = defineProps({
  id: String,
  filter: Array
})
const emits = defineEmits(['click'])
const { queryLayer, zIndex, symbol, dataType, renderPlugin, jsonData } = usePubVtLayer()
const features = computed(() => {
  try {
    const parsedJson = JSON.parse(jsonData.value)
    if (parsedJson?.features && parsedJson.features.length > 0) {
      return parsedJson.features
    } else {
      return []
    }
  } catch (err) {
    return []
  }
})

function getVisible(filter, properties) {
  if (filter && filter.length > 0) {
    const [type, name, ...rest] = filter
    if (type === 'in') {
      return rest.includes(properties[name])
    } else {
      return false
    }
  } else {
    return true
  }
}

const simpleFeatures = computed(() => {
  return features.value
    .filter((feature) => !!feature?.geometry?.coordinates)
    .filter((feature) => {
      return getVisible(props.filter, feature.properties)
    })
    .map((feature) => {
      return {
        id: feature.id,
        coordinates: feature.geometry.coordinates,
        options: {
          properties: feature.properties
        }
      }
    })
})

const style = computed(() => {
  if (symbol.value && renderPlugin.value) {
    return {
      symbol: symbol.value,
      renderPlugin: renderPlugin.value,
      filter: true
    }
  }
  return null
})

function handleItemClick(e) {
  emits('click', e)
}

onMounted(() => {
  queryLayer(props.id, true)
})
</script>
