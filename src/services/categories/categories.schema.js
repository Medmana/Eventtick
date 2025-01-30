import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const categoriesSchema = {
  $id: 'Categories',
  type: 'object',
  additionalProperties: false,
  required: ['nom'], // Modifié de 'text' à 'nom'
  properties: {
    id: { type: 'number' },
    nom: { type: 'string' },
    description: { type: 'string' }
  }
}

export const categoriesValidator = getValidator(categoriesSchema, dataValidator)
export const categoriesResolver = resolve({})

export const categoriesExternalResolver = resolve({})

// Schema for creating new data
export const categoriesDataSchema = {
  $id: 'CategoriesData',
  type: 'object',
  additionalProperties: false,
  required: ['nom'], // Modifié de 'text' à 'nom'
  properties: {
    ...categoriesSchema.properties
  }
}
export const categoriesDataValidator = getValidator(categoriesDataSchema, dataValidator)
export const categoriesDataResolver = resolve({})

// Schema for updating existing data
export const categoriesPatchSchema = {
  $id: 'CategoriesPatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...categoriesSchema.properties
  }
}
export const categoriesPatchValidator = getValidator(categoriesPatchSchema, dataValidator)
export const categoriesPatchResolver = resolve({})

// Schema for allowed query properties
export const categoriesQuerySchema = {
  $id: 'CategoriesQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(categoriesSchema.properties)
  }
}
export const categoriesQueryValidator = getValidator(categoriesQuerySchema, queryValidator)
export const categoriesQueryResolver = resolve({})
