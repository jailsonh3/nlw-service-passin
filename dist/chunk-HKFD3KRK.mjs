import {
  prisma
} from "./chunk-XC2REWBA.mjs";

// src/routes/get-event-attendees.ts
import { z } from "zod";
async function getEventAttendees(app) {
  app.withTypeProvider().get(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: "get all attendees the event",
        tags: ["event"],
        params: z.object({
          eventId: z.string().uuid()
        }),
        querystring: z.object({
          query: z.string().nullish(),
          pageIndex: z.string().nullish().default("0").transform(Number)
        }),
        response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number().int(),
                ticketCode: z.string().min(4),
                name: z.string().nullable(),
                email: z.string().email(),
                createdAt: z.date(),
                checkInAt: z.date().nullable()
              })
            )
          })
        }
      }
    },
    async (request, reply) => {
      const { eventId } = request.params;
      const { pageIndex, query } = request.query;
      const attendees = await prisma.attendee.findMany({
        select: {
          id: true,
          ticketCode: true,
          name: true,
          email: true,
          createdAt: true,
          checkIn: {
            select: {
              createdAt: true
            }
          }
        },
        where: query ? {
          eventId,
          name: {
            contains: query
          }
        } : {
          eventId
        },
        take: 10,
        skip: pageIndex * 10,
        orderBy: {
          createdAt: "desc"
        }
      });
      return reply.send({
        attendees: attendees.map((attendee) => {
          return {
            id: attendee.id,
            ticketCode: attendee.ticketCode,
            name: attendee.name,
            email: attendee.email,
            createdAt: attendee.createdAt,
            checkInAt: attendee.checkIn?.createdAt ?? null
          };
        })
      });
    }
  );
}

export {
  getEventAttendees
};
