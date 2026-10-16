---
title: "Event-Driven Architecture Course at Dometrain"
date: 2026-10-15
description: A short summary of my new Event-Driven Architecture course at Dometrain.
tags: ["event-driven-architecture", "dometrain"]
---

I just signed up for Dometrain and am perusing the catalog of courses. I noticed they have a new course on Event-Driven Architecture, which is probably worth a refresher for me. I plan to take it and will share my thoughts here once I do.

The author is asking learners to take some time at the start of each module to perform an exercise. That's really what this post is for, to house my attempt at those exercises, and notes as I go.

## Theory of Event-Driven Architecture

The first request is to write down my current answers to:

- What is an event?
  - A fact that happened in the past.
- What is an event-driven architecture?
  - A system where the components react to events, as opposed to being called in a request-response fashion.

Pizza Store

- Order Processing Service
  - Kitchen Service
  - Pick-Up Service
  - Delivery Service
  - Loyalty Point Service (new, not in critical path)

> The appropriate level of coupling depends o the level of control you have over the endpoints.
>
> Gregor Hohpe

Event-Driven Architectures inverts dependencies (like dependency injection!) when compared to request-response systems.

- What is an event?
  - An **immutable** fact that happened in the past that cannot be changed.
- What is an event-driven architecture?
  - A **communication pattern**, and a way of modelling the integration between systems.
- Event-based system
  - Reacts to system events like btn_Click or s3-file-uploaded
- Event-driven system
  - Reacts to business events like OrderCreated or TaxReturnUploaded

- Messages
  - Events
    - Notification Event (thin event that just carries ids)
      - Often results in calls back into the publishing service, which can bog down the publisher
    - Event Carried State Transfer (thick event)
      - Increases coupling because more properties exposed
  - Commands
  - Queries

Message Channel

- Point to Point
- Publish / Subscribe

Channel Types

- Queue
  - Durable messages (SQS, Queue type in RabbitMQ, Azure SB Queues)
  - No guarantee ordering generally
- Bus / Topic
  - Pub/sub channels, most channels in EDA
  - Generally not durable if subscriber is offline
- Stream
  - Kafka, Amz Kinesis, Az Event Hub
  - Pub/sub + durability
  - Offset-based, append-only, immutable, partitioned log

Observability is a challenge, there will be solutions later.
