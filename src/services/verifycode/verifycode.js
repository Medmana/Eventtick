// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html

import { hooks as schemaHooks } from '@feathersjs/schema'
import {
  verifycodeDataValidator,
  verifycodePatchValidator,
  verifycodeQueryValidator,
  verifycodeResolver,
  verifycodeExternalResolver,
  verifycodeDataResolver,
  verifycodePatchResolver,
  verifycodeQueryResolver
} from './verifycode.schema.js'
import { VerifycodeService, getOptions } from './verifycode.class.js'

export const verifycodePath = 'verifycode'
export const verifycodeMethods = ['find', 'get', 'create', 'patch', 'remove']

export * from './verifycode.class.js'
export * from './verifycode.schema.js'

// A configure function that registers the service and its hooks via `app.configure`
export const verifycode = (app) => {
  // Register our service on the Feathers application
  app.use(verifycodePath, new VerifycodeService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: verifycodeMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(verifycodePath).hooks({
    around: {
      all: [
        schemaHooks.resolveExternal(verifycodeExternalResolver),
        schemaHooks.resolveResult(verifycodeResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(verifycodeQueryValidator),
        schemaHooks.resolveQuery(verifycodeQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(verifycodeDataValidator),
        schemaHooks.resolveData(verifycodeDataResolver)
      ],
      patch: [
        schemaHooks.validateData(verifycodePatchValidator),
        schemaHooks.resolveData(verifycodePatchResolver)
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
