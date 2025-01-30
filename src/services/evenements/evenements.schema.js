// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const evenementsSchema = {
  $id: 'Evenements',
  type: 'object',
  additionalProperties: false,
  required: ['nom', 'description', 'date', 'localisation', 'categorie_id'],
  properties: {
    id: { type: 'number' },
    nom: { type: 'string' },
    description: { type: 'string' },
    date: { type: 'string', format: 'date-time' },
    localisation: { type: 'string' },
    coordonnees: {
      type: 'object',
      properties: {
        latitude: { type: 'number' },
        longitude: { type: 'number' }
      },
      additionalProperties: false
    },
    imageUrl: { type: 'string', format: 'uri' },
    categorie_id: { type: 'string' },
    billetsDisponibles: { type: 'integer' },
    organisateur: { type: 'string' },
    categorie_nom: { type: ['string', 'null'] },
    search: { type: 'string' },
  }
}
export const evenementsValidator = getValidator(evenementsSchema, dataValidator)
export const evenementsResolver = resolve({
  properties: {
    // Inclure uniquement les champs nécessaires
    categorie_nom: async (value, event, context) => event.categorie_nom || null,
  },
})

export const evenementsExternalResolver = resolve({})

// Schema for creating new data
export const evenementsDataSchema = {
  $id: 'EvenementsData',
  type: 'object',
  additionalProperties: false,
  required: ['nom', 'description', 'date', 'localisation', 'categorie_id'],
  properties: {
    ...evenementsSchema.properties
  }
}
export const evenementsDataValidator = getValidator(evenementsDataSchema, dataValidator)
export const evenementsDataResolver = resolve({})

// Schema for updating existing data
export const evenementsPatchSchema = {
  $id: 'EvenementsPatch',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...evenementsSchema.properties
  }
}
export const evenementsPatchValidator = getValidator(evenementsPatchSchema, dataValidator)
export const evenementsPatchResolver = resolve({})

// Schema for allowed query properties
export const evenementsQuerySchema = {
  $id: 'EvenementsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(evenementsSchema.properties)
  }
}
export const evenementsQueryValidator = getValidator(evenementsQuerySchema, queryValidator)
export const evenementsQueryResolver = resolve({})
