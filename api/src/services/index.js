
import { evenements } from './evenements/evenements.js'
import { user } from './users/users.js'
export const services = (app) => {
 


  app.configure(evenements)

  app.configure(user)

  // All services will be registered here
}
