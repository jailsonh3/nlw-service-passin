import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../database/prisma";
import { BadRequest } from "./_errors/bad_request";

export async function getAttendeeBadge(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:ticketCode/badge', {
      schema: {
        summary: 'get attendee badge the event',
        tags: ['attendees'],
        params: z.object({
          ticketCode: z.string().min(4),
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string().email(),
              eventTitle: z.string(),
              checkInURL: z.string().url()
            }),
          })
        }
      }
    }, 
    async (request, reply) => {
      const { ticketCode } = request.params

      const attendee = await prisma.attendee.findUnique({
        select: {
          ticketCode: true,
          name: true,
          email: true,
          event: {
            select: {
              title: true,
            }
          }
        },
        where: {
          ticketCode,
        }
      })

      if(attendee === null) {
        throw new BadRequest('Attendee not found.')
      }

      const baseURL = `${request.protocol}://${request.hostname}`
      
      const checkInURL = new URL(`/attendees/${ticketCode}/check-in`, baseURL)

      return reply.send({
        badge: {
          name: attendee.name,
          email: attendee.email,
          eventTitle: attendee.event.title,
          checkInURL: checkInURL.toString(),
        }
      })
    })
}