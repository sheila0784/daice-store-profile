<template>
  <div class="footer-brand m-2">
    <div class="company">Purified Tube Ice • Garantisadong LIMPYO!</div>
    <div class="copyright">
      © {{ currentYear }} Da ICE
      <span>·</span>
      Powered by Mr. Freeze
    </div>
  </div>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>

<!-- <div class="footer-brand mt-2">
        <div class="company">Purified Tube Ice • Garantisadong LIMPYO!</div>
        <div class="copyright">© 2026 Da ICE · Powered by Mr. Freeze</div>
      </div> -->
