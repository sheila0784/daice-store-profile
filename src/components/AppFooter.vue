<template>
  <footer class="daice-footer">
    <div class="daice-footer-company ml-4">
      Purified Tube Ice
      <span class="daice-footer-separator">•</span>
      Garantisadong LIMPYO!
    </div>

    <div class="daice-footer-copyright mr-4">
      © {{ currentYear }} Da ICE
      <span class="daice-footer-separator">·</span>
      Powered by Mr. Freeze
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>