import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../database/prisma";
import { customAlphabet } from "nanoid";
import { BadRequest } from "./_errors/bad_request";

export async function registerForEvent(app: FastifyInstance) {
  app
  .withTypeProvider<ZodTypeProvider>()
    .post('/events/:eventId/attendees',
    {
      schema: {
        summary: 'Register attendees on event',
        tags: ['attendees'],
        body: z.object({
          name: z.string().min(4),
          email: z.string().email()
        }),
        params: z.object({
          eventId: z.string().uuid()
        }),
        response: {
          201: z.object({
            ticketCode: z.string().min(4)
          })
        }
      }
    },
    async (request, reply) => {
      const { eventId } = request.params
      const { name, email } = request.body

      const attendeeFromEmail = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            email,
            eventId,
          }
        }
      })

      if (attendeeFromEmail !== null) {
        throw new BadRequest('This e-mail is already registered for this event.')
      }

      const [event, amountOfAttendeesForEvent] = await Promise.all([
        prisma.event.findUnique({
          where: {
            id: eventId,
          }
        }),

        prisma.attendee.count({
          where: {
            eventId,
          }
        })
      ])  

      const limiteMaxAttendeesForEvent = event?.maximumAttendees 
        && amountOfAttendeesForEvent >= event.maximumAttendees 

      if (limiteMaxAttendeesForEvent) {
        throw new BadRequest('The maximum of attendees for this event has been reached.')
      }

      const nanoid = customAlphabet('204aqwetdf', 10)
      const ticketCode = nanoid(4)

      const attendee = await prisma.attendee.create({
        data: {
          ticketCode,
          name,
          email,
          eventId
        }
      })

      return reply.status(201).send({ ticketCode: attendee.ticketCode })
    })
}