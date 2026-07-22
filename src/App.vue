
 <template>
  <div class="daice-app-layout">
    <main class="daice-app-content">
      <router-view />
    </main>

    <AppFooter v-if="showFooter" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import AppFooter from "@/components/AppFooter.vue";

const route = useRoute();

const showFooter = computed(() => route.meta.showFooter !== false);

</script>