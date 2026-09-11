<template>
  <div class="daice-chart-card mb-4">
    <div class="daice-chart-header">
      <div class="daice-chart-icon">
        <i class="pi pi-box"></i>
      </div>

      <div>
        <h3 class="daice-chart-title">Volume Per Month</h3>
        <p class="daice-chart-subtitle">
          Monthly volume data through the Da ICE Customer app from
          {{ formatDateLabel(props.dateRange) }}.
        </p>
      </div>
    </div>

    <div class="daice-chart-content">
      <Chart
        v-if="hasChartData"
        type="line"
        :data="chartData"
        :options="chartOptions"
        class="daice-chart daice-monthly-customers"
      />

      <div v-else class="daice-chart-empty">
        <i class="pi pi-chart-line"></i>
        <p>No customer data found</p>
        <span>Try selecting a different date range.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import Chart from "primevue/chart";
import { useDashboardCards } from "@/composables/useDashboardCards";
import { formatDateLabel } from "@/utils/date";

const props = defineProps({
  dateRange: {
    type: Array,
    default: () => [],
  },
});

const { fetchVolume } = useDashboardCards();

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "Volume (Kg)",
      data: [],
      backgroundColor: "rgba(56, 189, 248, 0.16)",
        borderColor: "#0EA5E9",
        borderWidth: 3,
        fill: "origin",
        cubicInterpolationMode: "monotone",
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHitRadius: 12,
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: "#0284C7",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "#38BDF8",
        pointHoverBorderColor: "#0284C7",
    },
  ],
});

const hasChartData = computed(() => {
  return chartData.value.datasets[0]?.data?.length > 0;
});

const chartOptions = ref({
  indexAxis: "x",
  responsive: true,
  maintainAspectRatio: false,

  animation: {
    duration: 700,
    easing: "easeOutQuart",
  },

  interaction: {
    mode: "nearest",
    intersect: false,
  },

  layout: {
    padding: {
      top: 8,
      right: 18,
      bottom: 8,
      left: 8,
    },
  },

  plugins: {
    legend: {
      display: false,
    },

    tooltip: {
      displayColors: false,
      backgroundColor: "#0F172A",
      titleColor: "#E0F2FE",
      bodyColor: "#FFFFFF",
      borderColor: "#38BDF8",
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      // callbacks: {
      //   label(context) {
      //     return ` ${context.parsed.y.toLocaleString()} customers`;
      //   },
      // },

      callbacks: {
        label(context) {
          const count = context.parsed.y;

          return ` ${context.parsed.y.toLocaleString()} ${count === 1 ? "Kg" : "Kgs"}`;
        },
      },
    },
  },

  scales: {
    y: {
      beginAtZero: true,

      grid: {
        color: "rgba(148, 163, 184, 0.18)",
        drawBorder: false,
      },

      border: {
        display: false,
      },

      ticks: {
        color: "#64748B",
        precision: 0,
        font: {
          size: 11,
          weight: "600",
        },
      },

      title: {
        display: true,
        text: "Volume (Kg)",
        color: "#0369A1",
        font: {
          size: 12,
          weight: "700",
        },
        padding: {
          top: 12,
        },
      },
    },

    x: {
      grid: {
        display: false,
      },

      border: {
        display: false,
      },

      ticks: {
        color: "#334155",
        font: {
          size: 12,
          weight: "600",
        },
        padding: 8,
      },

      title: {
        display: true,
        text: "Month",
        color: "#0369A1",
        font: {
          size: 12,
          weight: "700",
        },
      },
    },
  },
});

function formatApiDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

async function loadChart(startDate, endDate) {
  const records = await fetchVolume({
    start_date: formatApiDate(startDate),
    end_date: formatApiDate(endDate),
  });

  chartData.value = {
    labels: records.map((row) => row.month_name ?? "Unknown month"),
    datasets: [
      {
        label: "Volume",
        data: records.map((row) => Number(row.order_volume) || 0),
        backgroundColor: "rgba(56, 189, 248, 0.16)",
        borderColor: "#0EA5E9",
        borderWidth: 3,
        fill: "origin",
        cubicInterpolationMode: "monotone",
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHitRadius: 12,
        pointBackgroundColor: "#FFFFFF",
        pointBorderColor: "#0284C7",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "#38BDF8",
        pointHoverBorderColor: "#0284C7",
      },
    ],
  };
}

watch(
  () => props.dateRange,
  (range) => {
    const startDate = range?.[0];
    const endDate = range?.[1];

    if (!startDate || !endDate) return;

    loadChart(startDate, endDate);
  },
  {
    immediate: true,
    deep: true,
  },
);
</script>

<style scoped>
.daice-monthly-customers {
  position: relative;
  width: 100%;
  height: 320px;
}

@media (max-width: 640px) {
  .daice-monthly-customers {
    height: 280px;
  }
}
</style>
