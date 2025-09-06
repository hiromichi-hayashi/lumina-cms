import { FastifyInstance } from 'fastify'
import fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'

export function createApp(options = {}): FastifyInstance {
  const app = fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
    ...options,
  })

  // Register plugins
  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })

  app.register(cors, {
    origin:
      process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL!]
        : ['http://localhost:3000'],
  })

  app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })

  app.register(swagger, {
    swagger: {
      info: {
        title: 'Lumina CMS API',
        description: 'API for Lumina CMS',
        version: '1.0.0',
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
      host: process.env.API_HOST || `localhost:${process.env.API_PORT || 8080}`,
      schemes: process.env.NODE_ENV === 'production' ? ['https'] : ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
    },
  })

  app.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
  })

  // Health check route
  app.get('/health', async (_request, _reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  return app
}
