// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, getValidator, querySyntax } from '@feathersjs/schema';
import { dataValidator, queryValidator } from '../../validators.js';

// Main data model schema
export const evsSchema = {
  $id: 'Evs',
  type: 'object',
  additionalProperties: false,
  required: ['nom', 'description', 'date', 'localisation', 'categorie_id'], // Ajout des champs requis
  properties: {
    nom: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
    date: { type: 'string', format: 'date-time' },
    localisation: { type: 'string', minLength: 1 },
    coordonnees: {
      type: 'object',
      properties: {
        latitude: { type: 'number' },
        longitude: { type: 'number' }
      },
      additionalProperties: false
    },
    imageUrl: { type: 'string', format: 'uri' },
    categorie_id: {
      anyOf: [
        { type: 'number' },
        { type: 'string', minLength: 1 }, // Autorise les ObjectId sous forme de chaînes
        { type: 'object' } // Pour un éventuel support avancé
      ]
    },
    billetsDisponibles: { type: 'integer', minimum: 0 },
    organisateur: { type: 'string', minLength: 1 },
    categorie_nom: { type: ['string', 'null'] },
    search: { type: 'string', minLength: 1 }
  }
};

export const evsValidator = getValidator(evsSchema, dataValidator);

export const evsResolver = resolve({
  properties: {
    // Inclure uniquement les champs nécessaires ou calculés
    categorie_nom: async (value, event, context) => event.categorie_nom || null
  }
});

export const evsExternalResolver = resolve({});

// Schema for creating new data
export const evsDataSchema = {
  $id: 'EvsData',
  type: 'object',
  additionalProperties: false,
  required: ['nom', 'description', 'date', 'localisation', 'categorie_id'], // Champs obligatoires pour la création
  properties: {
    ...evsSchema.properties
  }
};

export const evsDataValidator = getValidator(evsDataSchema, dataValidator);
export const evsDataResolver = resolve({});

// Schema for updating existing data
export const evsPatchSchema = {
  $id: 'EvsPatch',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...evsSchema.properties
  }
};

export const evsPatchValidator = getValidator(evsPatchSchema, dataValidator);
export const evsPatchResolver = resolve({});

// Schema for allowed query properties
export const evsQuerySchema = {
  $id: 'EvsQuery',
  type: 'object',
  additionalProperties: false,
  properties: {
    ...querySyntax(evsSchema.properties)
  }
};

export const evsQueryValidator = getValidator(evsQuerySchema, queryValidator);
export const evsQueryResolver = resolve({});
