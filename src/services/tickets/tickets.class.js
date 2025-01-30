import { MongoDBService } from "@feathersjs/mongodb";
import { MongoClient, ObjectId } from "mongodb";

export class TicketsService extends MongoDBService {
  // Création d'un ticket
  async create(data, params) {
    const { evenement_id, description, prix, nombre_disponible } = data;

    if (!evenement_id || !description || prix === undefined || nombre_disponible === undefined) {
      throw new Error("Tous les champs requis doivent être renseignés.");
    }

    // Validation et conversion de l'ID de l'événement
    if (typeof evenement_id === "string") {
      data.evenement_id = new ObjectId(evenement_id);
    }

    const ticket = await super.create(data, params);

    // Mise à jour des billets disponibles pour l'événement associé
    await this.updateBilletDisponibles(data.evenement_id);

    return ticket;
  }

  // Mise à jour partielle d'un ticket
  async patch(id, data, params) {
    const ticket = await super.patch(id, data, params);

    if (data.nombre_disponible !== undefined || data.evenement_id !== undefined) {
      const evenement_id = data.evenement_id || ticket.evenement_id;
      await this.updateBilletDisponibles(evenement_id);
    }

    return ticket;
  }

  // Suppression d'un ticket
  async remove(id, params) {
    const ticket = await super.get(id); // Récupération du ticket avant suppression
    const result = await super.remove(id, params);

    // Mise à jour des billets disponibles pour l'événement associé
    await this.updateBilletDisponibles(ticket.evenement_id);

    return result;
  }

  // Mise à jour des billets disponibles d'un événement
  async updateBilletDisponibles(evenement_id) {
    const totalTickets = await this.options.Model.aggregate([
      { $match: { evenement_id: new ObjectId(evenement_id) } },
      { $group: { _id: null, total: { $sum: "$nombre_disponible" } } },
    ]).toArray();

    const totalDisponibles = totalTickets.length > 0 ? totalTickets[0].total : 0;

    // Mise à jour du champ `billetsDisponibles` dans la collection `evenements`
    const mongoUri = 'mongodb+srv://ahiffonman:R89uLzvBB5Eoh7mE@cluster0.j2sgs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

  // Connexion à MongoDB
  const mongoClient = new MongoClient(mongoUri);
    const db = mongoClient.db('EventTick');
    const evenementsCollection = db.collection('evenements');
    await evenementsCollection.updateOne(
      { _id: new ObjectId(evenement_id) },
      { $set: { billetsDisponibles: totalDisponibles } }
    );
  }

  // Récupération des tickets (avec jointures et filtres)
  async find(params) {
    const query = [];

    // Filtrer par ID de l'événement
    if (params.query && params.query.evenement_id) {
      query.push({
        $match: { evenement_id: new ObjectId(params.query.evenement_id) },
      });
    }

    // Jointure avec la collection `evenements`
    query.push({
      $lookup: {
        from: "evenements",
        localField: "evenement_id",
        foreignField: "_id",
        as: "evenement",
      },
    });

    query.push({ $unwind: "$evenement" });

    // Filtrer par catégorie (optionnel)
    if (params.query && params.query.categorie_id) {
      query.push({
        $match: { "evenement.categorie_id": new ObjectId(params.query.categorie_id) },
      });
    }

    // Exécution de la requête d'agrégation
    const tickets = await this.options.Model.aggregate(query).toArray();
    return tickets;
  }
}


export const getOptions = (app) => {
  const mongoUri = 'mongodb+srv://ahiffonman:R89uLzvBB5Eoh7mE@cluster0.j2sgs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

  // Connexion à MongoDB
  const mongoClient = new MongoClient(mongoUri);
  const db = mongoClient.db('EventTick'); // Sélectionne la base de données par défaut
  const ticketsCollection = db.collection('tickets'); // Récupère la collection 'evenements'

  return {
    paginate: app.get('paginate'),
    Model: ticketsCollection,
    name: 'tickets',
  };
};
