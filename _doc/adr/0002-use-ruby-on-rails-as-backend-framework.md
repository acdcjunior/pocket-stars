# 2. Use Ruby on Rails as backend framework

Date: 2021-07-14

## Status

Accepted

## Context

As in any kind of web app, a backend technology should be chosen. There are countless possibilities available
in the market, and many variables come into play when choosing a tech stack. This document records the reasoning behind our decision and the trade-offs evaluated.

**Evaluated options.** The [challenge spec](https://gumroad.notion.site/Coding-challenge-v2-f7aa85150edd41eeb3537aae4632619f) itself does not mandate
any specific technologies for the backend. The development team has extensive experience in JavaScript and Java environments.
In spite of that, no other stack other than the Ruby language and the Ruby on Rails framework have been seriously considered for adoption, as they are
the tools currently adopted by the company.

**Risks.** Considering the experience of the developers with this specific stack, this decision represents a challenge. At the same time,
it is an opportunity for learning and generating a baseline for comparison and comments about the used programming styled and the one adopted by the company.

**Versions.** Not much thought has been put into the versions, since this is a demo project. We have chosen the latest
for both Ruby (3.0.2) and Rails (6.1.4).

## Decision

We will use Ruby and Rails as language/framework.

## Consequences

Download environment and install tools/gems accordingly.