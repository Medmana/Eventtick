import { KnexService } from '@feathersjs/knex'
import { MongoDBService } from '@feathersjs/mongodb';

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class VerifycodeService extends MongoDBService {}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('sqliteClient'),
    name: 'verifycode'
  }
}
