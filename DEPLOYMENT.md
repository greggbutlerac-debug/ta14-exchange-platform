# TA-14 Exchange Platform Deployment Guide

## V0.3.2 — Development and Demonstration Deployment

This document describes how to verify, deploy, observe, and safely operate the current TA-14 Exchange Platform release.

The governing principle remains:

> **No admissible evidence. No admissible execution.**

Deployment success does not convert demonstration infrastructure into production governance infrastructure.

A successful build proves that the application compiled and passed its configured checks. It does not prove production custody, lawful authority, independent verification, evidence truth, or real-world execution.

---

## Current deployment

Public deployment:

**https://ta14-exchange-platform-theta.vercel.app/**

Governance Workspace:

**https://ta14-exchange-platform-theta.vercel.app/workspace**

Route Evaluation Workspace:

**https://ta14-exchange-platform-theta.vercel.app/workspace/routes/new**

Repository:

**https://github.com/greggbutlerac-debug/ta14-exchange-platform**

---

## Current release boundary

V0.3.2 is a working development and demonstration platform.

It currently includes:

- Public TA-14 Exchange pages
- Governance Workspace
- Visual Route Builder
- Eight-stage route construction
- Browser-based route transfer
- Vendor-payment demonstration
- AI Governance route evaluation
- Adapter-boundary handling
- Deterministic route decisions
- Preserved adverse-result behavior
- Route correction and rerun behavior
- Signed demonstration receipts
- Hash-chained route events
- Public verification surfaces
- Registry lookup
- Verification-bundle download
- Local and evolving managed-storage behavior

It is not yet a complete production implementation of:

- Authentication
- Tenant isolation
- Evidence custody
- Payment processing
- Managed cryptographic signing
- Independent verification
- Certification
- Enterprise security
- Disaster recovery
- Regulatory compliance
- Production audit separation

---

## Required local environment

Use:

- Node.js 22 through 24
- npm 10.8.1 through 10.x
- Git
- A supported modern browser

Confirm the installed versions:

```bash
node --version
npm --version
git --version
