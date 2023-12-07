import { WEBHOOK_SECRET } from "$env/static/private";
import prisma from "$lib/db/prisma";
import { error, json, type RequestEvent } from "@sveltejs/kit";
import { Webhook, type WebhookRequiredHeaders } from "svix";

type EventType = "user.created" | "user.updated" | "*";

type Event = {
  data: Record<string, string | number>;
  object: "event";
  type: EventType;
};

async function handler(event: RequestEvent) {
  const payload = await event.request.json();
  const headersList = event.request.headers;
  const heads = {
    "svix-id": headersList.get("svix-id"),
    "svix-timestamp": headersList.get("svix-timestamp"),
    "svix-signature": headersList.get("svix-signature"),
  };
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: Event | null = null;

  try {
    evt = wh.verify(
      JSON.stringify(payload),
      heads as WebhookRequiredHeaders
    ) as Event;
  } catch (err) {
    throw error(400, {
      message: "Invalid signature",
    });
  }

  const eventType: EventType = evt.type;
  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, ...attributes } = evt.data;

    if (typeof id !== "string") {
      throw error(400, {
        message: "ID must be a string",
      });
    }
    await prisma.user.upsert({
      where: { clerkId: id },
      create: {
        clerkId: id,
        attributes,
      },
      update: { attributes },
    });
    return json({
      status: "success",
      message: "User updated successfully",
    });
  }
  return json({
    status: "error",
    message: "Invalid event type",
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
