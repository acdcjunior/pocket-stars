# 3. Use vanilla JavaScript plus jQuery as frontend technology

Date: 2021-07-15

## Status

Accepted

## Context

For the frontend technology, we will use vanilla (plain) JavaScript to build the dynamic content. In addition, we will
make the jQuery lib available, so it can be used when it can make the code simpler.

**Rationale.** The main reason for the decision is the challenge spec. Although it leaves the adoption of jQuery as
optional, we understand that legacy codebases have a high probability of containing jQuery code. Therefore, portraying
our ability to employ it may be of use for the company.

Additionally, although the vanilla JavaScript API has much evolved in the last 10 years, jQuery can still make
more compact and readable code in some situations.

**Versions.** Since there are no requirements for supporting older versions, we will latest jQuery (3.6.0) and will write ES6 JavaScript
code. Our goal is to target latest (evergreen) browsers.

## Decision

We will use vanilla JavaScript and jQuery as frontend technology.

## Consequences

Install jquery package and configure accordingly.
