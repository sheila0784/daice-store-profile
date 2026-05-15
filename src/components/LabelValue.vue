<template>
  <div class="grid grid-cols-[200px_1fr] gap-y-3 gap-x-6 m-1">


    <div class="font-medium pr-8">
      {{ label }}:
    </div>

    <div>
      <slot>
        {{ value }}
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    default: ''
  }
})
</script>