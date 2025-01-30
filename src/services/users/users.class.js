import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { MongoDBService } from '@feathersjs/mongodb';
import { MongoClient } from 'mongodb'

export class UserService extends MongoDBService {
  async create(data, params) {
    const { email } = data;

    // Vérifier si l'email existe déjà dans la base de données MongoDB
    
    const existingUser = await this.options.Model.findOne({ email });

    if (existingUser) {
      throw new Error("L'email est déjà utilisé");
    }
    // Générer un code de vérification aléatoire
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    // Configurer le transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Ou un autre service (ex. Outlook, Yahoo)
      auth: {
        user: 'eventtick14@gmail.com', // Remplacez par votre adresse email
        pass: 'eyst yjsw ifrw jkmj', // Remplacez par votre mot de passe ou token d'application
      },
    });

    console.log(`Email: ${email}`);
    console.log(`Code de vérification: ${verificationCode}`);

    // Envoyer l'email avec le code de vérification
    await transporter.sendMail({
      from: 'eventtick14@gmail.com',
      to: email,
      subject: 'Code de vérification pour votre compte EventTick',
      text: `Bonjour et bienvenue sur EventTick !

Nous sommes ravis de vous compter parmi nos membres.

Pour finaliser votre inscription et commencer à profiter des fonctionnalités d'EventTick, veuillez utiliser le code suivant pour vérifier votre adresse email :

Code de vérification : ${verificationCode}

Ce code est valable pendant une période limitée. Une fois validé, vous pourrez accéder à toutes les fonctionnalités de notre plateforme.

Si vous avez des questions, n'hésitez pas à nous contacter.

Merci de rejoindre EventTick et à bientôt sur la plateforme !

L'équipe EventTick`,
    });

    // Ajouter le code de vérification et d'autres informations à l'utilisateur
    const userData = {
      ...data,
      verificationCode, // Champ pour stocker le code de vérification
      verified: false, // Champ pour indiquer si l'utilisateur est vérifié
    };

    // Appeler la méthode `create` parente pour sauvegarder l'utilisateur
    return super.create(userData, params);
  }

  // Autres méthodes standards pour trouver, récupérer, mettre à jour ou supprimer un utilisateur
  async find(params) {
    return super.find(params);
  }

  async get(id, params) {
    return super.get(id, params);
  }

  async patch(id, data, params) {
    return super.patch(id, data, params);
  }

  async remove(id, params) {
    return super.remove(id, params);
  }
}

export const getOptions = (app) => {
  const mongoUri = 'mongodb+srv://ahiffonman:R89uLzvBB5Eoh7mE@cluster0.j2sgs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  
  // Connexion à MongoDB
  const mongoClient = new MongoClient(mongoUri);
  const db = mongoClient.db('EventTick'); // Sélectionne la base de données par défaut
  const usersCollection = db.collection('users'); // Récupère la collection 'users'

  return {
    paginate: app.get('paginate'),
    Model: usersCollection,
    name: 'users',
  };
};