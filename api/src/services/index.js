import { evs } from './evs/evs.js'
import { verifycode } from './verifycode/verifycode.js'
import { achatickets } from './achatickets/achatickets.js'
import { tickets } from './tickets/tickets.js'
import { categories } from './categories/categories.js'
import { evenements } from './evenements/evenements.js'
import { user } from './users/users.js'
export const services = (app) => {
  app.configure(evs)

  app.configure(verifycode)

  app.configure(achatickets)

  app.configure(tickets)

  app.configure(categories)

  app.configure(evenements)

  app.configure(user)

  // All services will be registered here
}
