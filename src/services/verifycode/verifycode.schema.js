// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema'
import { dataValidator, queryValidator } from '../../validators.js'

// Main data model schema
export const verifycodeSchema = {
  $id: 'Verifycode',
  type: 'object',
  additionalProperties: false,
  required: ['id', 'text'],
  properties: {
    id: { type: 'number' },
    text: { type: 'string' }
  }
}
export const verifycodeValidator = getValidator(verifycodeSchema, dataValidator)
export const verifycodeResolver = resolve({})

export const verifycodeExternalResolver = resolve({})

// Schema for creating new data
export const verifycodeDataSchema = {
  $id: 'VerifycodeData',
  type: 'object',
  additionalProperties: false,
  required: ['text'],
  properties: {
    ...verifycodeSchema.properties
  }
}
export const verifycodeDataValidator = getValidator(verifycodeDataSchema, dataValidator)
export const verifycodeDataResolver = resolve({})

// Schema for updating existing data
export const verifycodePatchSchema = {
  $id: 'VerifycodePatch',
  type: 'object',
  additionalProperties: false,
  required: [],
  properties: {
    ...verifycodeSchema.properties
  }
}
export const verifycodePatchValidator = getValidator(verifycodePatchSchema, dataValidator)
export const verifycodePatchResolver = resolve({})

// Schema for allowed query properties
export const verifycodeQuerySchema = {
  $id: 'VerifycodeQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(verifycodeSchema.properties)
  }
}
export const verifycodeQueryValidator = getValidator(verifycodeQuerySchema, queryValidator)
export const verifycodeQueryResolver = resolve({})
