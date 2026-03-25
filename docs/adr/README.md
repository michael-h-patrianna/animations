# Architecture Decision Records (ADRs)

This directory contains Architecture Decision Records (ADRs) for the Animation Catalog project.

## What is an ADR?

An Architecture Decision Record (ADR) is a document that captures an important architectural decision made along with its context and consequences.

## Format

Each ADR follows this structure:

- **Title**: A short, descriptive title
- **Status**: proposed | accepted | superseded | deprecated
- **Context**: The issue or problem we're addressing
- **Decision**: What we decided to do
- **Consequences**: What becomes easier or harder as a result

## Index

- [ADR-001: Framer Motion as Primary Animation Driver](./ADR-001-framer-motion.md)
- [ADR-002: Co-located Component Metadata System](./ADR-002-colocated-metadata.md)
- [ADR-003: Test Infrastructure with Vitest and Playwright](./ADR-003-test-infrastructure.md)
- [ADR-004: State Machine Refactoring Strategy](./ADR-004-state-machine-refactoring.md)
- [ADR-005: Ban Blur and Non-Linear Gradients as Animated Properties](./ADR-005-ban-animated-blur-and-gradients.md)
- [ADR-006: Self-Contained Animation Components](./ADR-006-self-contained-animations.md)
- [ADR-007: Auto-Discovery via import.meta.glob](./ADR-007-auto-discovery-glob.md)
- [ADR-008: Lint Config Integrity Enforcement](./ADR-008-lint-integrity-enforcement.md)
- [ADR-009: Modal-Open Demo Separation](./ADR-009-modal-open-demo-separation.md)

## Creating New ADRs

1. Copy the template from an existing ADR
2. Number it sequentially (ADR-XXX)
3. Fill in all sections with meaningful content
4. Update this index
5. Get team review before marking as "accepted" (lol)
