<template>
  <div class="daice-chart-card mb-4">
    <div class="daice-chart-header">
      <div class="daice-chart-icon">
        <i class="pi pi-users"></i>
      </div>

      <div>
        <h3 class="daice-chart-title">Customer Registrations and Activity</h3>
        <p class="daice-chart-subtitle">
          Monthly new registrations and unique customers with delivered orders through the Da ICE
          Customer app for
          {{ formatDateLabel(props.dateRange) }}.
        </p>
      </div>
    </div>

    <div class="daice-chart-content">
      <Chart
        v-if="hasChartData"
        type="bar"
        :data="chartData"
        :options="chartOptions"
        class="daice-chart daice-customer-comparison"
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

const { fetchCustomerCount } = useDashboardCards();

function buildChartData(records = []) {
  const barStyle = {
    borderWidth: 1,
    borderRadius: 6,
    borderSkipped: false,
    maxBarThickness: 32,
    categoryPercentage: 0.7,
    barPercentage: 0.85,
    grouped: true,
  };

  return {
    labels: records.map((row) => row.month_name ?? "Unknown month"),
    datasets: [
      {
        ...barStyle,
        label: "Newly Registered Customers",
        data: records.map((row) => Number(row.no_of_regcust) || 0),
        backgroundColor: "#38BDF8",
        hoverBackgroundColor: "#0EA5E9",
        borderColor: "#0EA5E9",
      },
      {
        ...barStyle,
        label: "Active Customers",
        data: records.map((row) => Number(row.active_customers) || 0),
        backgroundColor: "#0369A1",
        hoverBackgroundColor: "#075985",
        borderColor: "#075985",
      },
    ],
  };
}

const chartData = ref(buildChartData());

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
    mode: "index",
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
      display: true,
      position: "bottom",
      labels: {
        color: "#334155",
        usePointStyle: true,
        pointStyle: "rectRounded",
        padding: 20,
        font: { size: 12, weight: "600" },
      },
    },

    tooltip: {
      displayColors: true,
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

      callbacks: {
        label(context) {
          const count = context.parsed.y;

          return ` ${context.dataset.label}: ${count.toLocaleString()} ${count === 1 ? "customer" : "customers"}`;
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
        text: "No. of Customers",
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
  const records = await fetchCustomerCount({
    start_date: formatApiDate(startDate),
    end_date: formatApiDate(endDate),
  });

  chartData.value = buildChartData(records);
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
.daice-customer-comparison {
  position: relative;
  width: 100%;
  height: 360px;
}

@media (max-width: 640px) {
  .daice-customer-comparison {
    height: 320px;
  }
}
</style>
