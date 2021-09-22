# 7. Use Rails' ActionCable as Realtime Technology

Date: 2021-07-18

## Status

Accepted

## Context

As result of a direct requirement from the coding challenge, the app must now update
the reviews in realtime.

Many platforms provide realtime support. Prominent examples include [firebase](https://firebase.google.com/) (paid) 
and [supabase](https://supabase.io/) (OSS). Implement WebSockets directly is also an option, depending
on the requirements of the specific app.

For Pocket Stars, since we already are using Rails, its support for WebSockets via ActionCable is a natural
(and cheap) choice. This is the reason we are choosing it over the alternatives.

## Decision

Implement Realtime support using ActionCable.

## Consequences

N/A.
