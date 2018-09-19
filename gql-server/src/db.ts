import 'reflect-metadata'
import { createConnection, getConnectionOptions } from 'typeorm'

/**
 * TypeORM Connection
 */

async function setupTypeORMConnections() {
  const connectionOptions = await getConnectionOptions()
  console.log(connectionOptions)
  createConnection(connectionOptions)
  .then(_connection => {
    // here you can start to work with your entities
  })
  .catch(error => console.log(error))
}

export { setupTypeORMConnections }