/// <reference types="node" />
import { FastifyInstance } from "fastify";
export default function macos(fastify: FastifyInstance, options?: any): FastifyInstance<import("http").Server, import("http").IncomingMessage, import("http").ServerResponse, import("fastify").FastifyLoggerInstance>;
