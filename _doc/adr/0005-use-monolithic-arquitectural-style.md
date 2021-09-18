# 5. Use Monolithic Architectural Style

Date: 2021-07-18

## Status

Accepted

## Context

At the highest level, an application can be organized and deployed in many ways. The choice of which architectural style
to follow is of utmost importance to the success of the project.

Being a web app, the pocket-stars app could have its frontend and backend code packaged in separate deployment units in countless
ways. Nevertheless, due to proof-of-concept nature of the app and to the decision to use Rails as underlying
framework [[ADR#0002]](0002-use-ruby-on-rails-as-backend-and-mysql.md), the natural
choice is to follow its modular monolith architectural style, with a single deployment unit.

## Decision

Our application will follow the modular monolith architectural style, using the default layers proposed by Rails. 

## Consequences

N/A.
