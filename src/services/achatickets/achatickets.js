// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  achaticketsDataValidator,
  achaticketsPatchValidator,
  achaticketsQueryValidator,
  achaticketsResolver,
  achaticketsExternalResolver,
  achaticketsDataResolver,
  achaticketsPatchResolver,
  achaticketsQueryResolver
} from './achatickets.schema.js'
import { AchaticketsService, getOptions } from './achatickets.class.js'

export const achaticketsPath = 'achatickets'
export const achaticketsMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './achatickets.class.js'
export * from './achatickets.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const achatickets = (app) => {
  // Register our service on the Feathers application
  app.use(achaticketsPath, new AchaticketsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: achaticketsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(achaticketsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(achaticketsExternalResolver),
        schemaHooks.resolveResult(achaticketsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(achaticketsQueryValidator),
        schemaHooks.resolveQuery(achaticketsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(achaticketsDataValidator),
        schemaHooks.resolveData(achaticketsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(achaticketsPatchValidator),
        schemaHooks.resolveData(achaticketsPatchResolver)
      ],
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
