import { hooks } from '@feathersjs/authentication';
import pkg from '@feathersjs/authentication-local';
const { LocalStrategy } = pkg;

export const configureAuthentication = (app) => {
  // Configuration de la stratégie d'authentification locale
  app.configure(authentication({
    local: new LocalStrategy()
  }));

  // Ajouter des hooks à la service 'authentication'
  app.service('authentication').hooks({
    before: {
      create: [
        hooks.authenticate('local')  // Utilisation de la stratégie 'local' pour l'authentification
      ]
    }
  });

  // Définir les champs pour 'username' et 'password'
  app.get('authentication').local = {
    usernameField: 'email', // Utilisation du champ 'email' pour l'authentification
    passwordField: 'password'
  };
};
