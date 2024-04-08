import {
  generateSlug
} from "./chunk-RCIMDK4L.mjs";
import {
  BadRequest
} from "./chunk-5QBEOMCR.mjs";
import {
  prisma
} from "./chunk-XC2REWBA.mjs";

// src/routes/create-events.ts
import { z } from "zod";
async function createEvent(app) {
  app.withTypeProvider().post(
    "/events",
    {
      schema: {
        summary: "Create event",
        tags: ["event"],
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
      const { title, details, maximumAttendees } = request.body;
      const isEventAlreadyExists = await prisma.event.findUnique({
        where: {
          slug: generateSlug(title)
        }
      });
      if (isEventAlreadyExists !== null) {
        throw new BadRequest("Slug event already exists.");
      }
      const event = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug: generateSlug(title)
        }
      });
      return reply.status(201).send({ eventId: event.id });
    }
  );
}

export {
  createEvent
};
