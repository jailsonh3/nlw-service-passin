import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../database/prisma";
import { BadRequest } from "./_errors/bad_request";

export async function checkIn(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:ticketCode/check-in', 
    {
      schema: {
        summary: 'Check in event',
        tags: ['check-ins'],
        params: z.object({
          ticketCode: z.string().min(4)
        }),
        response: {
          201: z.null()
        }
      }
    },
    async (request, reply) => {
      const { ticketCode } = request.params

      const attendee = await prisma.attendee.findUnique({
        where: {
          ticketCode
        }
      })

      if(attendee === null) {
        throw new BadRequest('This Attendee not found.')
      }

      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          attendeeId: attendee.id
        }
      })

      if (attendeeCheckIn !== null) {
        throw new BadRequest('Attendee already checked in.')
      }

      await prisma.checkIn.create({
        data: {
          attendeeId: attendee.id
        }
      })

      return reply.status(201).send()
    })
}