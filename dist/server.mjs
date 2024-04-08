import {
  errorHandler
} from "./chunk-IENVL4K7.mjs";
import {
  checkIn
} from "./chunk-MPCXNZIJ.mjs";
import {
  createEvent
} from "./chunk-Q5FT2SSV.mjs";
import "./chunk-RCIMDK4L.mjs";
import {
  getAttendeeBadge
} from "./chunk-AAS7ELEM.mjs";
import {
  getEventAttendees
} from "./chunk-HKFD3KRK.mjs";
import {
  getEvent
} from "./chunk-ZPSHSUBY.mjs";
import {
  registerForEvent
} from "./chunk-SEUJHDEM.mjs";
import "./chunk-5QBEOMCR.mjs";
import "./chunk-XC2REWBA.mjs";

// src/server.ts
import { fastify } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
var app = fastify();
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass-in",
      description: "Especifica\xE7\xE3o da API para p backend da aplica\xE7\xE3o pass.in constru\xEDdo na nlw Unite.",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);
app.setErrorHandler(errorHandler);
app.listen({
  host: "0.0.0.0",
  port: 3333
}).then(() => console.log("HTTP server running!"));
