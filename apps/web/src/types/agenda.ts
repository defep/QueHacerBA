export interface Event {
  city: string
  name: string
  description: string
  category: string
  status: string
  date: string
  start_time: string | null
  end_time: string | null
  is_free: boolean | null
  price_text: string | null
  price_min: number | null
  price_max: number | null
  venue: string | null
  address: string
  audience: string[]
  sources: { entity: string; type: string; url: string }[]
}

export interface City {
  city: string
  events: Event[]
}

export interface Agenda {
  events: Event[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
