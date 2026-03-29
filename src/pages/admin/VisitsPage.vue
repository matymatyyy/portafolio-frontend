<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useVisitStats } from '@/composables/useVisitStats'

const { stats, loading, error, days, fetchStats, setDays } = useVisitStats()

onMounted(fetchStats)

const dayOptions = [7, 30, 90]

const maxDayCount = computed(() => {
  if (!stats.value?.visits_by_day.length) return 1
  return Math.max(...stats.value.visits_by_day.map((d) => d.count), 1)
})

const pageRows = computed(() => {
  if (!stats.value) return []
  return Object.entries(stats.value.visits_by_page)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
})

const referrerRows = computed(() => {
  if (!stats.value) return []
  return stats.value.top_referrers.slice(0, 10)
})

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatReferrer(ref: string): string {
  if (!ref) return '— direct'
  try {
    return new URL(ref).hostname
  } catch {
    return ref
  }
}
</script>

<template>
  <div class="visits">
    <!-- Header -->
    <div class="visits__header">
      <div>
        <h1 class="visits__title">Visitors</h1>
        <p class="visits__sub">Traffic analytics for your portfolio</p>
      </div>
      <div class="visits__filters">
        <button
          v-for="d in dayOptions"
          :key="d"
          class="visits__filter-btn"
          :class="{ 'visits__filter-btn--active': days === d }"
          @click="setDays(d)"
        >
          {{ d }}d
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="visits__loading">
      <span class="visits__spinner" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="visits__error">
      {{ error }}
      <button class="visits__retry" @click="fetchStats">Retry</button>
    </div>

    <template v-else-if="stats">
      <!-- Stat cards -->
      <div class="visits__cards">
        <div class="stat-card">
          <p class="stat-card__label">Total Visits</p>
          <p class="stat-card__value">
            {{ stats.total_visits.toLocaleString() }}
          </p>
        </div>
        <div class="stat-card">
          <p class="stat-card__label">Unique Visitors</p>
          <p class="stat-card__value">
            {{ stats.unique_visitors.toLocaleString() }}
          </p>
        </div>
        <div class="stat-card">
          <p class="stat-card__label">Avg. per Day</p>
          <p class="stat-card__value">
            {{
              stats.visits_by_day.length
                ? Math.round(stats.total_visits / stats.visits_by_day.length).toLocaleString()
                : '—'
            }}
          </p>
        </div>
        <div class="stat-card">
          <p class="stat-card__label">Pages Tracked</p>
          <p class="stat-card__value">
            {{ Object.keys(stats.visits_by_page).length }}
          </p>
        </div>
      </div>

      <!-- Daily bar chart -->
      <div class="visits__panel">
        <p class="visits__panel-title">Visits per Day</p>
        <div v-if="stats.visits_by_day.length" class="chart">
          <div class="chart__bars">
            <div v-for="day in stats.visits_by_day" :key="day.date" class="chart__col">
              <span class="chart__count">{{ day.count }}</span>
              <div
                class="chart__bar"
                :style="{ height: Math.max((day.count / maxDayCount) * 100, 2) + '%' }"
                :title="`${formatDate(day.date)}: ${day.count} visits`"
              />
              <span class="chart__label">{{ formatDate(day.date) }}</span>
            </div>
          </div>
        </div>
        <p v-else class="visits__empty">No data for this period.</p>
      </div>

      <!-- Pages + Referrers -->
      <div class="visits__grid2">
        <!-- By page -->
        <div class="visits__panel">
          <p class="visits__panel-title">Top Pages</p>
          <table v-if="pageRows.length" class="visits__table">
            <thead>
              <tr>
                <th>Page</th>
                <th class="visits__table-num">Visits</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="[page, count] in pageRows" :key="page">
                <td class="visits__table-path">
                  {{ page }}
                </td>
                <td class="visits__table-num">
                  <span class="visits__badge">{{ count.toLocaleString() }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else class="visits__empty">No page data yet.</p>
        </div>

        <!-- Top referrers -->
        <div class="visits__panel">
          <p class="visits__panel-title">Top Referrers</p>
          <table v-if="referrerRows.length" class="visits__table">
            <thead>
              <tr>
                <th>Source</th>
                <th class="visits__table-num">Visits</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in referrerRows" :key="row.referrer">
                <td class="visits__table-path">
                  {{ formatReferrer(row.referrer) }}
                </td>
                <td class="visits__table-num">
                  <span class="visits__badge">{{ row.count.toLocaleString() }}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <p v-else class="visits__empty">No referrer data yet.</p>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.visits {
  max-width: 1100px;
}

/* Header */
.visits__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.visits__title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #111;
  margin: 0 0 0.25rem;
}

.visits__sub {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.visits__filters {
  display: flex;
  gap: 0.375rem;
}

.visits__filter-btn {
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
  cursor: pointer;
  transition:
    border-color 0.15s,
    color 0.15s,
    background 0.15s;
  font-family: inherit;
}

.visits__filter-btn:hover {
  border-color: #5b21b6;
  color: #5b21b6;
}
.visits__filter-btn--active {
  background: #5b21b6;
  border-color: #5b21b6;
  color: #fff;
}

/* Loading / error */
.visits__loading {
  display: flex;
  justify-content: center;
  padding: 6rem 0;
}

.visits__spinner {
  display: block;
  width: 40px;
  height: 40px;
  border: 3px solid #ede9fe;
  border-top-color: #5b21b6;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.visits__error {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  color: #991b1b;
  font-size: 0.9rem;
}

.visits__retry {
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  background: #991b1b;
  color: #fff;
  cursor: pointer;
  border: none;
  font-family: inherit;
}

/* Stat cards */
.visits__cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.stat-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
}

.stat-card__label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b7280;
  margin: 0 0 0.5rem;
}

.stat-card__value {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #5b21b6;
  margin: 0;
  line-height: 1;
}

/* Panels */
.visits__panel {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1.25rem;
}

.visits__panel-title {
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b7280;
  margin: 0 0 1.25rem;
}

.visits__grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

/* Bar chart */
.chart {
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.chart__bars {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 180px;
  padding-bottom: 2rem;
  min-width: max-content;
}

.chart__col {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  flex: 1;
  min-width: 36px;
  height: 100%;
  position: relative;
}

.chart__count {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #6b7280;
}

.chart__bar {
  width: 100%;
  background: linear-gradient(to top, #5b21b6, #7c3aed);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: opacity 0.15s;
  cursor: default;
}

.chart__bar:hover {
  opacity: 0.75;
}

.chart__label {
  font-size: 0.6875rem;
  color: #9ca3af;
  white-space: nowrap;
  position: absolute;
  bottom: -1.5rem;
}

/* Table */
.visits__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.visits__table th {
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #9ca3af;
  padding: 0 0 0.625rem;
  border-bottom: 1px solid #e5e7eb;
}

.visits__table td {
  padding: 0.625rem 0;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
}

.visits__table tr:last-child td {
  border-bottom: none;
}

.visits__table-num {
  text-align: right;
}

.visits__table-path {
  font-family: 'Menlo', 'Consolas', monospace;
  font-size: 0.8125rem;
  color: #111;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.visits__badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: #ede9fe;
  color: #5b21b6;
  border-radius: 99px;
  font-size: 0.8125rem;
  font-weight: 700;
}

.visits__empty {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .visits__grid2 {
    grid-template-columns: 1fr;
  }
}
</style>
