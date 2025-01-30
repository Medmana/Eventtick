// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  ticketsDataValidator,
  ticketsPatchValidator,
  ticketsQueryValidator,
  ticketsResolver,
  ticketsExternalResolver,
  ticketsDataResolver,
  ticketsPatchResolver,
  ticketsQueryResolver
} from './tickets.schema.js'
import { TicketsService, getOptions } from './tickets.class.js'

export const ticketsPath = 'tickets'
export const ticketsMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './tickets.class.js'
export * from './tickets.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const tickets = (app) => {
  // Register our service on the Feathers application
  app.use(ticketsPath, new TicketsService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: ticketsMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(ticketsPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(ticketsExternalResolver),
        schemaHooks.resolveResult(ticketsResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(ticketsQueryValidator), schemaHooks.resolveQuery(ticketsQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(ticketsDataValidator), schemaHooks.resolveData(ticketsDataResolver)],
      patch: [schemaHooks.validateData(ticketsPatchValidator), schemaHooks.resolveData(ticketsPatchResolver)],
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
