# Architecture Decision Records

## What ADRs are

An architecture decision record (ADR) is a document that captures an important
architecture decision made along with its context and consequences. They track
major decisions that change the course of the project.

## Why we have them

Recording these decisions helps developers and stakeholders become familiar
with decisions made for the development and implementation of products.
They identify key team decisions and document them in a common place.

## What do they look like

This repository uses a naming convention where each ADR is serially numbered
and has clear tag in the file name, such as `0002-storybook.md`. The desired
format itself is outlined in an [ADR Template](0000-ADR-template.md).

## How are they accepted

A draft ADR should be submitted in a Pull Request (PR). A draft merged to the
`main` branch is considered to be accepted. ADRs in a state other than
accepted are not allowed in the main branch.
