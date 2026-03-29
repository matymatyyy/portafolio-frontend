<script setup lang="ts">
import { ref } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { logout } = useAuth()
const route = useRoute()
const collapsed = ref(false)

const navItems = [
  { name: 'admin-projects', label: 'Projects', match: 'project' },
  { name: 'admin-users', label: 'Users', match: 'user' },
  { name: 'admin-visits', label: 'Visitors', match: 'visit' },
  { name: 'admin-cv', label: 'CV', match: 'cv' },
]

function isActive(match: string): boolean {
  const name = route.name?.toString() ?? ''
  return name.includes(match)
}
</script>

<template>
  <div class="admin" :class="{ 'admin--collapsed': collapsed }">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar--collapsed': collapsed }">
      <div class="sidebar__top">
        <RouterLink to="/" class="sidebar__logo">
          <span v-if="!collapsed">maty.</span>
          <span v-else>m.</span>
        </RouterLink>
        <nav class="sidebar__nav">
          <RouterLink
            v-for="item in navItems"
            :key="item.name"
            :to="{ name: item.name }"
            class="sidebar__link"
            :class="{ 'sidebar__link--active': isActive(item.match) }"
            :title="item.label"
          >
            <span class="sidebar__icon">
              <!-- Projects -->
              <svg
                v-if="item.match === 'project'"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
              <!-- Users -->
              <svg
                v-else-if="item.match === 'user'"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <!-- Visitors -->
              <svg
                v-else-if="item.match === 'visit'"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <!-- CV -->
              <svg
                v-else-if="item.match === 'cv'"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
              </svg>
            </span>
            <span v-if="!collapsed" class="sidebar__label">{{ item.label }}</span>
          </RouterLink>
        </nav>
      </div>
      <div class="sidebar__bottom">
        <button
          class="sidebar__toggle"
          :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          @click="collapsed = !collapsed"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path v-if="!collapsed" d="M15 18l-6-6 6-6" />
            <path v-else d="M9 18l6-6-6-6" />
          </svg>
        </button>
        <button class="sidebar__logout" @click="logout">
          <span class="sidebar__icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </span>
          <span v-if="!collapsed" class="sidebar__label">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="admin__main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.admin {
  display: flex;
  min-height: 100vh;
  background: #f8f9fb;
}

.sidebar {
  width: 220px;
  min-height: 100vh;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem 1rem;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
  transition: width 0.25s ease;
}

.sidebar--collapsed {
  width: 64px;
  padding: 1.5rem 0.5rem;
}

.sidebar__top {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar__logo {
  font-size: 1.25rem;
  font-weight: 900;
  color: #5b21b6;
  letter-spacing: -0.04em;
  text-decoration: none;
  padding: 0 0.5rem;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #6b7280;
  text-decoration: none;
  transition:
    background 0.15s,
    color 0.15s;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar--collapsed .sidebar__link {
  justify-content: center;
  padding: 0.625rem;
}

.sidebar__link:hover {
  background: #f3f4f6;
  color: #111;
}
.sidebar__link--active {
  background: #ede9fe;
  color: #5b21b6;
  font-weight: 600;
}

.sidebar__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}
.sidebar__label {
  white-space: nowrap;
}

.sidebar__bottom {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sidebar__toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 8px;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  font-family: inherit;
  width: 100%;
  transition:
    background 0.15s,
    color 0.15s;
}

.sidebar__toggle:hover {
  background: #f3f4f6;
  color: #111;
}

.sidebar__logout {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  border: none;
  background: none;
  font-family: inherit;
  width: 100%;
  transition:
    background 0.15s,
    color 0.15s;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar--collapsed .sidebar__logout {
  justify-content: center;
  padding: 0.625rem;
}

.sidebar__logout:hover {
  background: #fee2e2;
  color: #991b1b;
}

.admin__main {
  flex: 1;
  margin-left: 220px;
  padding: 2rem;
  min-height: 100vh;
  transition: margin-left 0.25s ease;
}

.admin--collapsed .admin__main {
  margin-left: 64px;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100% !important;
    min-height: auto;
    position: relative;
    flex-direction: row;
    align-items: center;
    padding: 1rem;
  }
  .sidebar--collapsed {
    width: 100% !important;
    padding: 1rem;
  }
  .sidebar__top {
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }
  .sidebar__nav {
    flex-direction: row;
  }
  .sidebar__bottom {
    flex-direction: row;
    align-items: center;
  }
  .sidebar__logout {
    width: auto;
  }
  .sidebar__toggle {
    display: none;
  }
  .admin__main {
    margin-left: 0 !important;
  }
  .admin {
    flex-direction: column;
  }
}
</style>
