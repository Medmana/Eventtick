import { AuthenticationService, LocalStrategy } from '@feathersjs/authentication-local';
import { hooks } from '@feathersjs/authentication';

export const authentication = app => {
  app.configure(
    new AuthenticationService(app)
      .register('local', new LocalStrategy())
  );

  app.service('authentication').hooks({
    before: {
      create: [
        hooks.authenticate('local')
      ]
    }
  });

  // Spécifie le champ pour le nom d'utilisateur
  app.get('authentication').local = {
    usernameField: 'email',  // Utilise 'email' comme champ pour le nom d'utilisateur
    passwordField: 'password' // Champ pour le mot de passe
  };
};
