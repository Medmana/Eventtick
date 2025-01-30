import { MongoDBService } from '@feathersjs/mongodb';
import { MongoClient, ObjectId } from 'mongodb';

export class EvenementsService extends MongoDBService {
  // Méthode pour récupérer les événements (avec filtrage et tri)
  async find(params) {
    const now = new Date().toISOString();; // Date actuelle pour le filtre
  
    // Construire le filtre MongoDB à partir des paramètres de requête
    const query = {
      date: { $gte: now }, // Filtrer les événements à venir
    };
  
    if (params.query && params.query.categorie_id) {
      if (typeof params.query.categorie_id === 'string') {
        try {
          query.categorie_id = new ObjectId(params.query.categorie_id);
        } catch (error) {
          console.error('Invalid ObjectId:', params.query.categorie_id);
          throw new Error('categorie_id dans la requête doit être un ObjectId valide.');
        }
      } else {
        query.categorie_id = params.query.categorie_id;
      }
    }
  
    if (params.query && params.query.localisation) {
      query.localisation = { $regex: params.query.localisation, $options: 'i' }; // Recherche insensible à la casse
    }
  
    if (params.query && params.query.search) {
      query.nom = { $regex: params.query.search, $options: 'i' }; // Recherche insensible à la casse
    }
  
  
    // Effectuer la recherche
    const events = await this.options.Model.find(query).toArray();
    
    // Trier de manière aléatoire
    return events.sort(() => Math.random() - 0.5);
  }
  
  // Méthode pour créer un événement
  async create(data, params) {
    const { nom, description, date, localisation, categorie_id } = data;
  
    // Validation des champs requis
    if (!nom || !description || !date || !localisation || !categorie_id) {
      throw new Error('Tous les champs requis doivent être renseignés.');
    }
  
    // Validation et conversion de categorie_id
    if (typeof categorie_id === 'string') {
      // Si c'est une chaîne, tentez de la convertir en ObjectId
      try {
        data.categorie_id = new ObjectId(categorie_id);
      } catch (error) {
        throw new Error('categorie_id doit être un ObjectId valide.');
      }
    } else if (typeof categorie_id !== 'number' && typeof categorie_id !== 'object') {
      // Vérifie si categorie_id est soit un nombre, soit un objet
      throw new Error('categorie_id doit être un nombre, un objet ou une chaîne valide.');
    }
  
    // Appeler la méthode create de la classe parente pour enregistrer les données
    return super.create(data, params);
  }
  

  // Méthode pour mettre à jour partiellement un événement
  async patch(id, data, params) {
    if (data.coordonnees) {
      const { latitude, longitude } = data.coordonnees;
      if (!latitude || !longitude) {
        throw new Error('Les coordonnées doivent inclure une latitude et une longitude.');
      }
    }

    return super.patch(id, data, params);
  }

  // Méthode pour supprimer un événement
  async remove(id, params) {
    const event = await super.get(id, params);
    if (!event) {
      throw new Error(`Événement avec l'ID ${id} introuvable.`);
    }

    return super.remove(id, params);
  }
}

// Options pour initialiser le service avec MongoDB
export const getOptions = (app) => {
  const mongoUri = 'mongodb+srv://ahiffonman:R89uLzvBB5Eoh7mE@cluster0.j2sgs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

  // Connexion à MongoDB
  const mongoClient = new MongoClient(mongoUri);
  const db = mongoClient.db('EventTick'); // Sélectionne la base de données par défaut
  const evenementsCollection = db.collection('evenements'); // Récupère la collection 'evenements'

  return {
    paginate: app.get('paginate'),
    Model: evenementsCollection,
    name: 'evenements',
  };
};
