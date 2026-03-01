export interface Event {
  name: string
  description: string
  day: string
  time: string
  cost: string
  venue: string
  source: string
  audience: string[]
}

export interface City {
  city: string
  events: Event[]
}

export interface Summary {
  total_events: number
  free_events: number
  paid_events: number
  cities_with_events: string[]
  cities_without_events: string[]
}

export interface WeekendAgenda {
  date: string
  cities: City[]
  summary: Summary
  notes: string[]
}

export interface AgendaResponse {
  weekend_agenda: WeekendAgenda
}
