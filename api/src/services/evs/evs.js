// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  evsDataValidator,
  evsPatchValidator,
  evsQueryValidator,
  evsResolver,
  evsExternalResolver,
  evsDataResolver,
  evsPatchResolver,
  evsQueryResolver
} from './evs.schema.js'
import { EvsService, getOptions } from './evs.class.js'

export const evsPath = 'evs'
export const evsMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './evs.class.js'
export * from './evs.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const evs = (app) => {
  // Register our service on the Feathers application
  app.use(evsPath, new EvsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: evsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(evsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(evsExternalResolver),
        schemaHooks.resolveResult(evsResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(evsQueryValidator), schemaHooks.resolveQuery(evsQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(evsDataValidator), schemaHooks.resolveData(evsDataResolver)],
      patch: [schemaHooks.validateData(evsPatchValidator), schemaHooks.resolveData(evsPatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}
