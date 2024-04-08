import {
  BadRequest
} from "./chunk-5QBEOMCR.mjs";
import {
  prisma
} from "./chunk-XC2REWBA.mjs";

// src/routes/check-in.ts
import { z } from "zod";
async function checkIn(app) {
  app.withTypeProvider().get(
    "/attendees/:ticketCode/check-in",
    {
      schema: {
        summary: "Check in event",
        tags: ["check-ins"],
        params: z.object({
          ticketCode: z.string().min(4)
        }),
        response: {
          201: z.null()
        }
      }
    },
    async (request, reply) => {
      const { ticketCode } = request.params;
      const attendee = await prisma.attendee.findUnique({
        where: {
          ticketCode
        }
      });
      if (attendee === null) {
        throw new BadRequest("This Attendee not found.");
      }
      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          attendeeId: attendee.id
        }
      });
      if (attendeeCheckIn !== null) {
        throw new BadRequest("Attendee already checked in.");
      }
      await prisma.checkIn.create({
        data: {
          attendeeId: attendee.id
        }
      });
      return reply.status(201).send();
    }
  );
}

export {
  checkIn
};
