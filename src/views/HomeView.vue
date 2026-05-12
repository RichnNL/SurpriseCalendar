<script setup lang="ts">
import UserProfileMenu from '../components/UserProfileMenu.vue'
import SwitchProfileDropdown from '../components/SwitchProfileDropdown.vue'
import SelectCalendarDropdown from '../components/SelectCalendarDropdown.vue'
</script>

<template>
  <div class="home-layout">
    <!-- Top Row: User Profile & Calendar Selection -->
    <header class="top-row">
      <UserProfileMenu />
      
      <div class="header-actions">
        <SwitchProfileDropdown />
        <SelectCalendarDropdown />
      </div>
    </header>

    <!-- Main Calendar Area -->
    <main class="calendar-area">
      <div class="placeholder-content">
        <h2>Calendar View</h2>
        <p>Main calendar placeholder. Takes up most of the screen.</p>
      </div>
    </main>

    <!-- Bottom Minimap Area -->
    <footer class="minimap-area">
      <div class="placeholder-content minimap-placeholder">
        <h3>Minimap</h3>
        <p>20% of the bottom</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.home-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: var(--color-background);
  overflow: hidden;
}

/* Top Row */
.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
}


.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}



/* Main Calendar Area */
.calendar-area {
  flex: 1; /* Takes up all remaining space */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
  position: relative;
}

.calendar-area .placeholder-content {
  text-align: center;
  padding: 3rem;
  border: 2px dashed var(--color-border);
  border-radius: 16px;
  color: var(--color-text-muted);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* Bottom Minimap Area */
.minimap-area {
  flex: 0 0 20%; /* Exactly 20% height */
  min-height: 80px; /* Ensure it doesn't get squished */
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
}

.minimap-placeholder {
  text-align: center;
  color: var(--color-tertiary);
  width: 100%;
  height: 100%;
  border: 1px dashed var(--color-tertiary);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
