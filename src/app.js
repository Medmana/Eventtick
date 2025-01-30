// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { koa, rest, bodyParser, errorHandler, parseAuthentication, cors, serveStatic } from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'
import { MongoClient } from 'mongodb'
import { configurationValidator } from './configuration.js'
import { logError } from './hooks/log-error.js'
import { authentication } from './authentication.js'
import { services } from './services/index.js'
import { channels } from './channels.js'

const app = koa(feathers())

// Load our app configuration (see config/ folder)
app.configure(configuration(configurationValidator))

// Set up Koa middleware
app.use(cors())
app.use(errorHandler())
app.use(parseAuthentication())
app.use(bodyParser())


// URL de la base de données MongoDB
const mongoUri = 'mongodb+srv://ahiffonman:R89uLzvBB5Eoh7mE@cluster0.j2sgs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connexion à MongoDB
const mongoClient = new MongoClient(mongoUri);

async function connectToMongo() {
  try {
    await mongoClient.connect();
    console.log('MongoDB connecté avec succès 🚀');

    // Utilisation de la base de données "EventTick"
    const db = mongoClient.db('EventTick');

    // Utilisation de la collection 'users' pour exécuter une recherche
    const usersCollection = db.collection('users');  // Assure-toi que le nom est correct
    const users = await usersCollection.find().toArray();  // Requête de recherche sur la collection 'users'
    console.log('Utilisateurs récupérés:', users);

  } catch (err) {
    console.error('Erreur de connexion à MongoDB :', err);
  }
}

connectToMongo();


app.use('/events/:evenement_id/tickets', {
  async find(params) {
    const { evenement_id } = params.route;
    if (!evenement_id) {
      throw new BadRequest("L'ID de l'événement est obligatoire.");
    }
    return app.service('achatickets').getTicketsByEvent(evenement_id);
  }
});

// Configure services and transports
app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: app.get('origins')
    }
  })
)

app.configure(authentication)

app.configure(services)
app.configure(channels)

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }
