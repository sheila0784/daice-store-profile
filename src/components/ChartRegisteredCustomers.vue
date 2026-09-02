<template>
  <div class="daice-chart-card mb-4">
    <div class="daice-chart-header">
      <div class="daice-chart-icon">
        <i class="pi pi-users"></i>
      </div>

      <div>
        <h3 class="daice-chart-title">Registered Customers by Dealer</h3>
        <p class="daice-chart-subtitle">
          Dealers ranked by customers registered through the Da ICE Customer app from
          {{ formatDateLabel(props.dateRange) }}
        </p>
      </div>
    </div>

    <div class="daice-chart-content">
      <Chart
        v-if="hasChartData"
        type="bar"
        :data="chartData"
        :options="chartOptions"
        class="daice-chart"
      />

      <div v-else class="daice-chart-empty">
        <i class="pi pi-chart-bar"></i>
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

const { fetchRegCustPerDealer } = useDashboardCards();

const chartData = ref({
  labels: [],
  datasets: [
    {
      label: "Registered Customers",
      data: [],
      backgroundColor: "#38BDF8",
      hoverBackgroundColor: "#0284C7",
      borderColor: "#0EA5E9",
      borderWidth: 1,
      borderRadius: 8,
      borderSkipped: false,
      barThickness: 24,
      maxBarThickness: 32,
    },
  ],
});

const hasChartData = computed(() => {
  return chartData.value.datasets[0]?.data?.length > 0;
});

const chartOptions = ref({
  indexAxis: "y",
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
      //     return ` ${context.parsed.x.toLocaleString()} customers`;
      //   },
      // },

      callbacks: {
        label(context) {
          const count = context.parsed.x;

          return ` ${context.parsed.x.toLocaleString()} ${count <= 1 ? "customer" : "customers"}`;
        },
      },
    },
  },

  scales: {
    x: {
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
        text: "Registered Customers",
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

    y: {
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
        text: "Dealer",
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
  const records = await fetchRegCustPerDealer({
    start_date: formatApiDate(startDate),
    end_date: formatApiDate(endDate),
  });

  chartData.value = {
    labels: records.map((row) => row.dealer_name ?? row.dealer ?? "Unknown dealer"),
    datasets: [
      {
        label: "Registered Customers",
        data: records.map((row) => Number(row.no_of_regcust) || 0),
        backgroundColor: "#38BDF8",
        hoverBackgroundColor: "#0284C7",
        borderColor: "#0EA5E9",
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 24,
        maxBarThickness: 32,
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
