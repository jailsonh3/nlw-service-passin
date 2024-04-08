import { FastifyInstance } from "fastify"
import { z } from "zod"
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from "../database/prisma"
import { generateSlug } from "../utils/generation-slug"
import { BadRequest } from "./_errors/bad_request"

export async function createEvent(app: FastifyInstance) {

  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events', { 
      schema: {
        summary: 'Create event',
        tags: ['event'],
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable()
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid()
          })
        }
      }
    },
    async (request, reply) => {
      const { title, details, maximumAttendees } = request.body

      const isEventAlreadyExists = await prisma.event.findUnique({
        where: {
          slug: generateSlug(title)
        }
      })

      if(isEventAlreadyExists !== null) {
        throw new BadRequest('Slug event already exists.')
      }

      const event = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug: generateSlug(title),
        }
      })

      return reply.status(201).send({ eventId: event.id })

  })

}

