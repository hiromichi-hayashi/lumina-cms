import { createApp } from './app'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

async function start() {
  const app = createApp()

  try {
    const port = parseInt(process.env.API_PORT || '8080', 10)
    const host = process.env.HOST || '0.0.0.0'

    await app.listen({ port, host })
    app.log.info(`Server listening on http://${host}:${port}`)
    app.log.info(`Documentation available at http://${host}:${port}/docs`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
