import pkg from '@feathersjs/authentication-local';
const { LocalStrategy } = pkg;
import { hooks } from '@feathersjs/authentication';

export const authentication = app => {
  // Configure le service d'authentification
  app.configure(authentication({
    // Spécifie les stratégies d'authentification
    local: new LocalStrategy()
  }));

  // Ajoute les hooks nécessaires à l'authentification
  app.service('authentication').hooks({
    before: {
      create: [
        hooks.authenticate('local')
      ]
    }
  });

  // Définit le champ de l'utilisateur pour la stratégie locale
  app.get('authentication').local = {
    usernameField: 'email',  // Utilise 'email' pour l'authentification
    passwordField: 'password'  // Champ pour le mot de passe
  };
};
