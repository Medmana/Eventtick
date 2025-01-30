import { AuthenticationService, JWTStrategy } from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';

export const authentication = (app) => {
  const authentication = new AuthenticationService(app);

  // Enregistrement de la stratégie JWT pour l'authentification par token
  authentication.register('jwt', new JWTStrategy());

  // Enregistrement de la stratégie locale pour l'authentification avec email et mot de passe
  authentication.register('local', new LocalStrategy({
    async authenticate(credentials) {
      const { email, password } = credentials;

      // Trouver l'utilisateur par email
      const users = await app.service('users').find({
        query: { email },
      });

      // Si l'utilisateur n'existe pas
      if (users.length === 0) {
        throw new Error('Utilisateur non trouvé');
      }

      const userRecord = users[0];

      // Vérification de l'état de vérification du compte
      if (!userRecord.verified) {
        throw new Error('Votre compte n\'est pas encore vérifié. Veuillez vérifier votre email.');
      }

      // Comparer le mot de passe
      const isPasswordValid = await app.service('authentication').verifyPassword(password, userRecord.password);
      if (!isPasswordValid) {
        throw new Error('Mot de passe incorrect');
      }

      // Si tout est valide, retourner l'utilisateur
      return userRecord;
    }
  }));

  // Enregistrement du service d'authentification dans Feathers
  app.use('authentication', authentication);

  // Ici, vous n'avez plus besoin d'utiliser app.post() car Feathers gère déjà les requêtes d'authentification via le service 'authentication'.
};
