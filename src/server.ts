import { fastify } from 'fastify'

import fastifyCors from '@fastify/cors'

import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { createEvent } from './routes/create-events'
import { registerForEvent } from './routes/register-for-event'
import { getEvent } from './routes/get-event'
import { getAttendeeBadge } from './routes/get-attendee-badge'
import { checkIn } from './routes/check-in'
import { getEventAttendees } from './routes/get-event-attendees'
import { errorHandler } from './utils/error-handler'
import { env } from './env'

const app = fastify()

app.register(fastifyCors, {
  origin: "*",
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'pass-in',
      description: 'Especificação da API para p backend da aplicação pass.in construído na nlw Unite.',
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)
app.register(checkIn)
app.register(getEventAttendees)

app.setErrorHandler(errorHandler)

app.listen({
  host: '0.0.0.0',
  port: env.PORT
}).then(() => 
console.log(`HTTP server running in port ${env.PORT}!\n 
${new URL('/docs', `http://localhost:${env.PORT}`)}`)
)