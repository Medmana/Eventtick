import { MongoDBService } from '@feathersjs/mongodb';
import { MongoClient } from 'mongodb'

export class CategoriesService extends MongoDBService {
  // Vous pouvez personnaliser les méthodes ici si nécessaire
  async create(data, params) {
    const { nom } = data;

    // Vérifier si une catégorie avec ce nom existe déjà
    const existingCategory = await this.options.Model.findOne({ nom });

    if (existingCategory) {
      throw new Error("Le nom de la catégorie est déjà utilisé.");
    }

    // Ajouter des informations spécifiques ou valider les données
    return super.create(data, params);
  }

  async patch(id, data, params) {
    const { nom } = data;

    // Vérifier si une autre catégorie avec ce nom existe déjà
    if (nom) {
      const existingCategory = await this.options.Model.findOne({
        nom,
        _id: { $ne: this.options.Model.id(id) }, // Ignorer la catégorie actuelle
      });

      if (existingCategory) {
        throw new Error("Le nom de la catégorie est déjà utilisé.");
      }
    }

    return super.patch(id, data, params);
  }
}

export const getOptions = (app) => {
  const mongoUri = 'mongodb+srv://ahiffonman:R89uLzvBB5Eoh7mE@cluster0.j2sgs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    // Connexion à MongoDB
    const mongoClient = new MongoClient(mongoUri);
    const db = mongoClient.db('EventTick'); // Sélectionne la base de données par défaut
    const categoriesCollection = db.collection('categories');
  return {
    paginate: app.get('paginate'),
    Model: categoriesCollection,
    name: 'categories',
  };
};
