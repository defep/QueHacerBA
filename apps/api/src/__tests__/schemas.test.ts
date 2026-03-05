import { describe, it, expect } from 'vitest'
import { EventApiSchema, EventsQuerySchema } from '@quehacerba/shared'

describe('EventApiSchema', () => {
  it('should parse valid event', () => {
    const event = {
      city: 'La Plata',
      name: 'Festival de Primavera',
      description: 'Un festival amazing',
      category: 'musica',
      status: 'active',
      date: '2026-03-15',
      start_time: '18:00',
      end_time: '23:00',
      is_free: true,
      price_text: 'Gratis',
      price_min: 0,
      price_max: 0,
      venue: 'Plaza Moreno',
      address: 'Av. 13 entre 51 y 53',
      audience: ['familias', 'niños'],
      sources: [{ entity: 'municipalidad', type: 'web', url: 'https://example.com' }],
    }

    const result = EventApiSchema.parse(event)
    expect(result.name).toBe('Festival de Primavera')
    expect(result.is_free).toBe(true)
  })

  it('should reject invalid event', () => {
    const event = {
      city: 'La Plata',
      name: '',
      description: 'Un festival',
    }

    expect(() => EventApiSchema.parse(event)).toThrow()
  })
})

describe('EventsQuerySchema', () => {
  it('should parse valid query params', () => {
    const query = { page: '1', limit: '20', audience: 'familias', city: 'La Plata' }
    const result = EventsQuerySchema.parse(query)
    
    expect(result.page).toBe(1)
    expect(result.limit).toBe(20)
    expect(result.audience).toBe('familias')
    expect(result.city).toBe('La Plata')
  })

  it('should use defaults for missing params', () => {
    const query = {}
    const result = EventsQuerySchema.parse(query)
    
    expect(result.page).toBe(1)
    expect(result.limit).toBe(20)
    expect(result.audience).toBeUndefined()
  })

  it('should validate limit max value', () => {
    const query = { page: '1', limit: '200' }
    expect(() => EventsQuerySchema.parse(query)).toThrow()
  })
})
