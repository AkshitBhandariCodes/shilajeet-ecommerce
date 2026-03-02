# Delhivery Integration - Complete Flow Diagram

## 1. Order Creation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER CREATES ORDER                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  POST /api/orders              │
        │  - Items                       │
        │  - Address                     │
        │  - Payment (COD/Prepaid)       │
        └────────────┬───────────────────┘
                     │
                     ▼
        ┌────────────────────────────────┐
        │  Validate Order Data           │
        │  - Check items                 │
        │  - Validate address            │
        │  - Verify payment              │
        └────────────┬───────────────────┘
                     │
                     ▼
        ┌────────────────────────────────┐
        │  Calculate Totals              │
        │  - Subtotal                    │