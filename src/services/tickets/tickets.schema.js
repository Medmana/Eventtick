// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const ticketsSchema = {$id: 'Tickets',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'evenement_id', 'description', 'prix', 'nombre_disponible'],
  properties: {
    id: { type: 'number' },
    evenement_id: { type: 'string' },
    description: { type: 'string' },
    prix: { type: 'number' },
    nombre_disponible: { type: 'number' },
    created_at: { type: 'string', format: 'date-time' },
    updated_at: { type: 'string', format: 'date-time' },
  },
}
export const ticketsValidator = getValidator(ticketsSchema, dataValidator)
export const ticketsResolver = resolve({})

export const ticketsExternalResolver = resolve({})

// Schema for creating new data
export const ticketsDataSchema = {
  $id: 'TicketsData',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...ticketsSchema.properties
  }
}
export const ticketsDataValidator = getValidator(ticketsDataSchema, dataValidator)
export const ticketsDataResolver = resolve({})

// Schema for updating existing data
export const ticketsPatchSchema = {
  $id: 'TicketsPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...ticketsSchema.properties
  }
}
export const ticketsPatchValidator = getValidator(ticketsPatchSchema, dataValidator)
export const ticketsPatchResolver = resolve({})

// Schema for allowed query properties
export const ticketsQuerySchema = {
  $id: 'TicketsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(ticketsSchema.properties)
  }
}
export const ticketsQueryValidator = getValidator(ticketsQuerySchema, queryValidator)
export const ticketsQueryResolver = resolve({})
