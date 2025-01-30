import QRCode from 'qrcode';
import { MongoDBService } from '@feathersjs/mongodb';
import { BadRequest } from '@feathersjs/errors';
import { MongoClient, ObjectId } from 'mongodb';

// Service Achatickets basé sur MongoDB
export class AchaticketsService extends MongoDBService {
  
  // Création de tickets pour un utilisateur
  async create(data, params) {
    const mongoUri = 'mongodb+srv://ahiffonman:R89uLzvBB5Eoh7mE@cluster0.j2sgs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

    // Connexion à MongoDB
    const mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect(); // Assurez-vous que la connexion est établie
    const db = mongoClient.db('EventTick'); // Sélectionner la base de données 'EventTick'
    const ticketsCollection = db.collection('tickets'); // Récupérer la collection 'tickets'
    const achaticketsCollection = db.collection('achatickets'); // Récupérer la collection 'achatickets'
    
    const { ticketId, quantity } = data;
    const user = params.user; // L'utilisateur connecté

    // Validation des champs requis
    if (!ticketId || !quantity) {
      throw new BadRequest('Le ticketId et la quantité sont obligatoires.');
    }

    if (!user) {
      throw new BadRequest("L'utilisateur doit être connecté.");
    }

    if (quantity < 1) {
      throw new BadRequest('La quantité doit être au moins égale à 1.');
    }

    // Vérifiez la disponibilité des tickets
    const ticket = await ticketsCollection.findOne({ _id: new ObjectId(ticketId) });

    if (!ticket) {
      throw new BadRequest("Le ticket demandé n'existe pas.");
    }

    if (ticket.nombre_disponible < quantity) {
      throw new BadRequest('La quantité demandée dépasse les tickets disponibles.');
    }

    // Mise à jour du nombre de tickets disponibles
    await ticketsCollection.updateOne(
      { _id: new ObjectId(ticketId) },
      { $inc: { nombre_disponible: -quantity } }
    );

    // Mise à jour des billets disponibles pour l'événement
    await this.updateBilletDisponibles(ticket.evenement_id);

    // Génération de tickets individuels avec un code QR unique pour chaque
    const purchases = [];
    for (let i = 0; i < quantity; i++) {
      const qrCodeData = {
        ticketId,
        userId: user._id,
        purchaseIndex: i + 1, // Numérotation des tickets
      };

      const qrCode = await QRCode.toDataURL(JSON.stringify(qrCodeData), {
        width: 10, // Taille du QR code
        errorCorrectionLevel: 'L', // Niveau de correction d'erreur
      });

      const purchase = {
        ticketId: new ObjectId(ticketId),
        userId: new ObjectId(user._id),
        qrCode,
        createdAt: new Date(),
      };

      // Ajout du ticket d'achat dans la collection 'achatickets'
      const createdPurchase = await achaticketsCollection.insertOne(purchase);
      purchases.push(createdPurchase); // Ajoutez l'objet créé au tableau des achats
    }

    return purchases;
  }

  // Mise à jour des billets disponibles pour un événement
  async updateBilletDisponibles(evenement_id) {
    // Connexion à MongoDB
    const mongoUri = 'mongodb+srv://ahiffonman:R89uLzvBB5Eoh7mE@cluster0.j2sgs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    const mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();  // Assurez-vous que la connexion est établie avant de continuer
    const db = mongoClient.db('EventTick');
    const ticketsCollection = db.collection('tickets'); // Récupération de la collection tickets
    
    try {
      const tickets = await ticketsCollection.aggregate([
        { $match: { evenement_id: new ObjectId(evenement_id) } },
        { $group: { _id: null, total: { $sum: '$nombre_disponible' } } },
      ]).toArray(); // Utilisez `toArray()` pour récupérer les résultats sous forme de tableau
  
      const totalDisponibles = tickets.length > 0 ? tickets[0].total : 0;
  
      // Mise à jour de l'événement avec le total des billets disponibles
      await db.collection('evenements').updateOne(
        { _id: new ObjectId(evenement_id) },
        { $set: { billetsDisponibles: totalDisponibles } }
      );
  
    } catch (error) {
      console.error('Erreur lors de la mise à jour des billets disponibles:', error);
      throw new Error("Une erreur est survenue lors de la mise à jour des billets disponibles.");
    } finally {
      await mongoClient.close();  // Fermez la connexion après avoir terminé
    }
  }

  async find(params) {
    const user = params.user;
  
    if (!user) {
      throw new BadRequest("L'utilisateur doit être connecté pour effectuer cette action.");
    }
    console.log('Objet utilisateur:', user);
    const userId = new ObjectId(user._id); // Assure-toi que l'ID de l'utilisateur est un ObjectId
    console.log('ID utilisateur:', userId); // Vérifie si l'ID est correct
  
    try {
      const mongoUri = 'mongodb+srv://ahiffonman:R89uLzvBB5Eoh7mE@cluster0.j2sgs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
      const mongoClient = new MongoClient(mongoUri);
      const db = mongoClient.db('EventTick');
      const achaticketsCollection = db.collection('achatickets');
      
      // Vérification des tickets de l'utilisateur
      const userTicketsCheck = await achaticketsCollection.find({ userId: userId }).toArray();
      console.log('Tickets de l\'utilisateur:', userTicketsCheck); // Affiche les tickets de l'utilisateur
  
      const userTickets = await achaticketsCollection.aggregate([
        { $match: { userId: userId } },
        {
          $lookup: {
            from: "tickets",
            localField: "ticketId",
            foreignField: "_id",
            as: "ticketDetails"
          }
        },
        { $unwind: "$ticketDetails" },
        {
          $lookup: {
            from: "evenements",
            localField: "ticketDetails.evenement_id",
            foreignField: "_id",
            as: "evenementDetails"
          }
        },
        { $unwind: "$evenementDetails" },
        {
          $project: {
            _id: 1,
            qrCode: 1,
            createdAt: 1,
            ticketDescription: "$ticketDetails.description",
            evenementNom: "$evenementDetails.nom",
            evenementDate: "$evenementDetails.date",
            evenementLocalisation: "$evenementDetails.localisation",
            evenementImageUrl: "$evenementDetails.imageUrl",
            evenementCoordonnees: "$evenementDetails.coordonnees"
          }
        }
      ]).toArray();
  
      console.log('Tickets récupérés:', userTickets); // Vérifie les tickets récupérés
  
      return userTickets;
    } catch (error) {
      console.error("Erreur lors de la récupération des tickets:", error.message);
      throw new Error("Une erreur est survenue lors de la récupération des tickets.");
    }
  }  
}

// Fonction pour récupérer les options du service
export const getOptions = async (app) => {
  const mongoUri = 'mongodb+srv://ahiffonman:R89uLzvBB5Eoh7mE@cluster0.j2sgs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

  // Connexion à MongoDB avec `await`
  const mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();  // Attendre la connexion
  const db = mongoClient.db('EventTick');  // Sélection de la base de données
  const achaticketsCollection = db.collection('achatickets'); // Récupérer la collection 'achatickets'

  return {
    paginate: app.get('paginate'),
    Model: achaticketsCollection,
    name: 'achatickets',
  };
};
