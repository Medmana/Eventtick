// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  evenementsDataValidator,
  evenementsPatchValidator,
  evenementsQueryValidator,
  evenementsResolver,
  evenementsExternalResolver,
  evenementsDataResolver,
  evenementsPatchResolver,
  evenementsQueryResolver
} from './evenements.schema.js'
import { EvenementsService, getOptions } from './evenements.class.js'

export const evenementsPath = 'evenements'
export const evenementsMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './evenements.class.js'
export * from './evenements.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const evenements = (app) => {
  // Register our service on the Feathers application
  app.use(evenementsPath, new EvenementsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: evenementsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(evenementsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(evenementsExternalResolver),
        schemaHooks.resolveResult(evenementsResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(evenementsQueryValidator),
        schemaHooks.resolveQuery(evenementsQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(evenementsDataValidator),
        schemaHooks.resolveData(evenementsDataResolver)
      ],
      patch: [
        schemaHooks.validateData(evenementsPatchValidator),
        schemaHooks.resolveData(evenementsPatchResolver)
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
