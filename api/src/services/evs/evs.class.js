import { MongoDBService } from '@feathersjs/mongodb';
import { MongoClient, ObjectId } from 'mongodb';

export class EvsService extends MongoDBService {
  async find(params) {
    const now = new Date().toISOString();
    const query = {
      date: { $lt: now }, // Filtre les événements avec une date antérieure à maintenant
    };

    // Appliquer les filtres si une catégorie est spécifiée
    if (params.query && params.query.categorie_id) {
  if (typeof params.query.categorie_id === 'string') {
    try {
      query.categorie_id = new ObjectId(params.query.categorie_id);
    } catch (error) {
      throw new Error('categorie_id dans la requête doit être un ObjectId valide.');
    }
  } else {
    query.categorie_id = params.query.categorie_id; // Utiliser tel quel si déjà au bon format
  }
}
    if (params.query && params.query.localisation) {
      query.localisation = { $regex: params.query.localisation, $options: 'i' }; // Recherche par localisation (insensible à la casse)
    }
    if (params.query && params.query.search) {
      query.nom = { $regex: params.query.search, $options: 'i' }; // Recherche par nom (insensible à la casse)
    }

    // Effectuer la recherche et trier les résultats de manière aléatoire
    const events = await this.options.Model.find(query).toArray();
    return events.sort(() => Math.random() - 0.5);
  }

  // Override the create method to add any custom logic
  async create(data, params) {
    const { nom, description, date, localisation, categorie_id } = data;

    // Validation des champs requis
    if (!nom || !description || !date || !localisation || !categorie_id) {
      throw new Error('Tous les champs requis doivent être renseignés.');
    }

    // Appeler la méthode create de la classe parente
    return super.create(data, params);
  }

  async patch(id, data, params) {
    // Ajouter une logique pour la mise à jour de champs spécifiques
    if (data.coordonnees) {
      const { latitude, longitude } = data.coordonnees;
      if (!latitude || !longitude) {
        throw new Error('Les coordonnées doivent inclure une latitude et une longitude.');
      }
    }

    return super.patch(id, data, params);
  }

  async remove(id, params) {
    // Vérifier si l'événement existe avant de le supprimer
    const event = await this.Model.findOne({ _id: new ObjectId(id) });
    if (!event) {
      throw new Error(`Événement avec l'ID ${id} introuvable.`);
    }

    return super.remove(id, params);
  }
}

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
