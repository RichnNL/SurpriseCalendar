import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

export interface CalendarRow {
  id: string
  name: string
  cell_count: number
  prizes_count: number
  created_by: string | null
  created_at: string
}

export interface CalendarRowWithRelations extends CalendarRow {
  profiles: { username: string } | null
  cells: { selected_by: string | null }[]
}

export interface Calendar {
  id: string
  name: string
  cell_count: number
  prizes_count: number
  created_by: string | null
  created_at: Date
  creator_username: string
  selected_cells_count: number
}

export interface CellRow {
  id: string
  calendar_id: string
  cell_number: number
  selected_by: string | null
  prize_id: string | null
  prizes?: { id: string; name: string; image_url: string } | null
}

export const useCalendarStore = defineStore('calendar', () => {
  const calendars = ref<Calendar[]>([])
  const activeCalendar = ref<Calendar | null>(null)
  const activeCells = ref<CellRow[]>([])
  const isLoading = ref(false)

  let calendarSub: RealtimeChannel | null = null
  let cellsSub: RealtimeChannel | null = null

  async function fetchCalendars() {
    isLoading.value = true
    try {
      const { data, error } = await supabase
        .from('calendars')
        .select(`
          *,
          profiles ( username ),
          cells ( selected_by )
        `)
        .order('created_at', { ascending: false })
        .overrideTypes<Array<CalendarRowWithRelations>, { merge: false }>()

      if (error) throw error

      calendars.value = (data || []).map((row) => ({
        id: row.id,
        name: row.name,
        cell_count: row.cell_count,
        prizes_count: row.prizes_count,
        created_by: row.created_by,
        created_at: new Date(row.created_at),
        creator_username: row.profiles?.username || 'Unknown',
        selected_cells_count: (row.cells || []).filter((c) => c.selected_by !== null).length
      }))
      
      // Update activeCalendar reference if it exists
      if (activeCalendar.value) {
        const updated = calendars.value.find(c => c.id === activeCalendar.value?.id)
        if (updated) activeCalendar.value = updated
      }
    } catch (error) {
      console.error('Error fetching calendars:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchActiveCells(calendarId: string) {
    try {
      const { data, error } = await supabase
        .from('cells')
        .select(`
          *,
          prizes ( id, name, image_url )
        `)
        .eq('calendar_id', calendarId)
        .order('cell_number', { ascending: true })
        .returns<CellRow[]>()

      if (error) throw error
      activeCells.value = data || []
    } catch (error) {
      console.error('Error fetching cells:', error)
    }
  }

  async function setActiveCalendar(calendar: Calendar) {
    activeCalendar.value = calendar
    await fetchActiveCells(calendar.id)
  }

  function initializeRealtime() {
    if (!calendarSub) {
      calendarSub = supabase.channel('public:calendars')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'calendars' }, () => {
          fetchCalendars()
        })
        .subscribe()
    }
    
    if (!cellsSub) {
      cellsSub = supabase.channel('public:cells')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'cells' }, () => {
          fetchCalendars()
          if (activeCalendar.value) {
            fetchActiveCells(activeCalendar.value.id)
          }
        })
        .subscribe()
    }
  }

  return {
    calendars,
    activeCalendar,
    activeCells,
    isLoading,
    fetchCalendars,
    fetchActiveCells,
    setActiveCalendar,
    initializeRealtime
  }
})
