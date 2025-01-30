// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const achaticketsSchema = {
  $id: 'AchaTickets',
  type: 'object',
  additionalProperties: false,
  required: ['ticketId', 'userId', 'qrCode'],
  properties: {
    id: { type: 'number' }, // ID unique
    ticketId: { type: 'string' }, // Référence au ticket
    userId: { type: 'string' }, // Référence à l'utilisateur
    qrCode: { type: 'string' }, // Code QR encodé
    createdAt: { type: 'string', format: 'date-time' },
  }
}
export const achaticketsValidator = getValidator(achaticketsSchema, dataValidator)
export const achaticketsResolver = resolve({})

export const achaticketsExternalResolver = resolve({})

// Schema for creating new data
export const achaticketsDataSchema = {
  $id: 'AchaticketsData',
  type: 'object',
  additionalProperties: false,
  required: ['ticketId', 'userId', 'quantity'], // 'quantity' reste obligatoire ici
  properties: {
    ticketId: { type: 'string' },
    userId: { type: 'string' },
    quantity: { type: 'number', minimum: 1 } // Ajout temporaire pour validation
  }
}
export const achaticketsDataValidator = getValidator(achaticketsDataSchema, dataValidator)
export const achaticketsDataResolver = resolve({})

// Schema for updating existing data
export const achaticketsPatchSchema = {
  $id: 'AchaticketsPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...achaticketsSchema.properties
  }
}
export const achaticketsPatchValidator = getValidator(achaticketsPatchSchema, dataValidator)
export const achaticketsPatchResolver = resolve({})

// Schema for allowed query properties
export const achaticketsQuerySchema = {
  $id: 'AchaticketsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(achaticketsSchema.properties)
  }
}
export const achaticketsQueryValidator = getValidator(achaticketsQuerySchema, queryValidator)
export const achaticketsQueryResolver = resolve({})
