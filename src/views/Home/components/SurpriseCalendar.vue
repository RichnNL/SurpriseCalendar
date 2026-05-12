<script setup lang="ts">
import { Viewport } from 'pixi-viewport'
import { Application, Graphics } from 'pixi.js'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useCalendarStore } from '../../../stores/calendar'

const props = defineProps<{
  cellCount: number
}>()

const calendarStore = useCalendarStore()
const containerRef = ref<HTMLElement | null>(null)

let app: Application | null = null
let viewport: Viewport | null = null
let gridGraphics: Graphics | null = null

const CELL_SIZE = 30
const CELL_GAP = 2
const TOTAL_SIZE = CELL_SIZE + CELL_GAP

// For HTML Numbers Overlay
const vpState = ref({ x: 0, y: 0, scale: 1 })
const visibleCells = ref<{ index: number, x: number, y: number }[]>([])

function updateVisibleCells() {
  if (!viewport || props.cellCount <= 0) return
  
  // Only show numbers if zoomed in enough (e.g. scale > 0.8) to prevent DOM bloat
  if (viewport.scale.x < 0.6) {
    visibleCells.value = []
    return
  }

  const cols = Math.ceil(Math.sqrt(props.cellCount))
  const rows = Math.ceil(props.cellCount / cols)

  const offsetX = 0
  const offsetY = 0

  const left = viewport.left
  const right = viewport.right
  const top = viewport.top
  const bottom = viewport.bottom

  let minCol = Math.floor((left - offsetX) / TOTAL_SIZE)
  let maxCol = Math.ceil((right - offsetX) / TOTAL_SIZE)
  let minRow = Math.floor((top - offsetY) / TOTAL_SIZE)
  let maxRow = Math.ceil((bottom - offsetY) / TOTAL_SIZE)

  minCol = Math.max(0, minCol)
  maxCol = Math.min(cols - 1, maxCol)
  minRow = Math.max(0, minRow)
  maxRow = Math.min(rows - 1, maxRow)

  const newCells = []
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      const index = r * cols + c
      if (index < props.cellCount) {
        newCells.push({
          index,
          x: offsetX + c * TOTAL_SIZE,
          y: offsetY + r * TOTAL_SIZE
        })
      }
    }
  }
  
  // Safety cap to prevent browser freeze
  if (newCells.length < 3000) {
    visibleCells.value = newCells
  } else {
    visibleCells.value = []
  }
}

async function initPixi() {
  if (!containerRef.value) return

  app = new Application()

  await app.init({
    resizeTo: containerRef.value,
    backgroundColor: 0x09090b,
    antialias: false,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  })

  containerRef.value.appendChild(app.canvas)

  viewport = new Viewport({
    screenWidth: containerRef.value.clientWidth,
    screenHeight: containerRef.value.clientHeight,
    worldWidth: 1000,
    worldHeight: 1000,
    events: app.renderer.events,
  })

  app.stage.addChild(viewport)

  // Enable interaction
  viewport.drag().pinch().wheel().decelerate()
  
  // Don't allow zooming out too far or zooming in too close
  viewport.clampZoom({ minScale: 1, maxScale: 10 })
  
  // Sync HTML overlay
  viewport.on('moved', () => {
    vpState.value = { x: viewport!.x, y: viewport!.y, scale: viewport!.scale.x }
    updateVisibleCells()
  })

  gridGraphics = new Graphics()
  viewport.addChild(gridGraphics)

  drawGrid()

  // Start zoomed in at the top-left of the calendar
  viewport.setZoom(5)
  viewport.moveCorner(0, 0)
  
  // Prevent panning way off the grid
  viewport.clamp({ direction: 'all' })
}

function drawGrid() {
  if (!gridGraphics || props.cellCount <= 0) return

  const cols = Math.ceil(Math.sqrt(props.cellCount))
  const rows = Math.ceil(props.cellCount / cols)

  // Convert active cells to a Set of cell_numbers for O(1) lookup
  const activeIndices = new Set(calendarStore.activeCells.map((c) => c.cell_number))

  gridGraphics.clear()

  // Start the grid at (0,0) so the viewport clamp bounds align perfectly
  const offsetX = 0
  const offsetY = 0

  // Update world size so viewport panning boundaries work nicely
  if (viewport) {
    viewport.worldWidth = cols * TOTAL_SIZE
    viewport.worldHeight = rows * TOTAL_SIZE
  }

  for (let i = 0; i < props.cellCount; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)

    const x = offsetX + col * TOTAL_SIZE
    const y = offsetY + row * TOTAL_SIZE

    // Assuming cell_number is 1-indexed in the database
    const isGreen = activeIndices.has(i + 1)

    gridGraphics.rect(x, y, CELL_SIZE, CELL_SIZE)
    gridGraphics.fill(isGreen ? 0x22c55e : 0xFF6B00)
  }
  
  // Initial overlay sync
  if (viewport) {
    vpState.value = { x: viewport.x, y: viewport.y, scale: viewport.scale.x }
    updateVisibleCells()
  }
}

onMounted(() => {
  initPixi()
})

onBeforeUnmount(() => {
  if (app) {
    app.destroy(true, { children: true, texture: true })
  }
})

// Redraw if active cells change
watch(
  () => calendarStore.activeCells,
  () => {
    drawGrid()
  },
  { deep: true },
)

// Redraw if calendar changes
watch(
  () => props.cellCount,
  () => {
    drawGrid()
  },
)
</script>

<template>
  <div class="calendar-container" ref="containerRef" v-if="props.cellCount > 0">
    <!-- LOD HTML Overlay that scales and translates identically to the Pixi Viewport -->
    <div 
      class="numbers-overlay" 
      :style="{ transform: `translate(${vpState.x}px, ${vpState.y}px) scale(${vpState.scale})` }"
    >
      <div 
        v-for="cell in visibleCells" 
        :key="cell.index" 
        class="cell-number" 
        :style="{ left: cell.x + 'px', top: cell.y + 'px' }"
      >
        {{ cell.index + 1 }}
      </div>
    </div>
  </div>
  <div v-else class="empty-state">
    <p>Please select or create a calendar</p>
  </div>
</template>

<style scoped>
.calendar-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-color: var(--color-background);
  /* The cursor style gives a hint that it's interactive */
  cursor: grab;
}

.calendar-container:active {
  cursor: grabbing;
}

.numbers-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  pointer-events: none; /* Let clicks pass through to PixiJS */
  transform-origin: 0 0;
  will-change: transform;
}

.cell-number {
  position: absolute;
  width: 30px; /* Maps to CELL_SIZE */
  height: 30px;
  display: flex;
  justify-content: flex-end; /* Align right */
  align-items: flex-start;   /* Align top */
  padding-top: 3px;
  padding-right: 3px;
  font-size: 8px; /* Base font size, viewport scales it naturally */
  font-weight: 800;
  color: rgba(0, 0, 0, 0.6);
  font-family: sans-serif;
  user-select: none;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--color-text-muted);
  font-size: 1.1rem;
}
</style>
