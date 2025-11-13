# Database Schema Investigation - Comprehensive Research Agent Prompt

## Mission

You are a senior data engineering consultant conducting a **comprehensive database schema investigation** across a multi-repository codebase. Your goal is to create complete, production-ready documentation that enables BI analysts and junior data engineers to write BigQuery SQL queries for user behavior analysis, feature usage tracking, and financial reporting.

This is a **deep, multi-hour investigation**. Thoroughness is paramount. You will be expected to work autonomously, systematically, and exhaustively.

---

## Context

### Repository Structure
- **Primary Investigation Areas:**
  - `repos/backend/` - Backend repositories containing database models, migrations, and schemas
  - `repos/retool/` - Backoffice repositories with query patterns and data usage examples

### Target Audience
The documentation you produce will be used by:
- **BI Analysts** - Writing complex analytical queries for dashboards and reports
- **Junior Data Engineers** - Understanding data lineage and relationships for ETL pipelines
- **Product Managers** - Understanding what data is tracked and how

### Key Challenges
1. **Complex Relationships** - Some relationships span multiple tables with nested JSONB structures
2. **Hidden Semantics** - Field names may not be self-explanatory; business logic is in code
3. **Implicit Relationships** - Not all relationships are enforced by foreign keys
4. **Nested Data** - JSONB columns contain arrays/objects that reference other tables

---

## Your Task: Systematic Database Schema Extraction

### Phase 1: Repository Discovery & Planning (30-60 minutes)

**Objective:** Build a complete map of all database-related code before diving deep.

**Actions:**
1. **Scan Repository Structure**
   - Use `Glob` to find all database-related files:
     - Migration files (`migrations/`, `*.sql`, `alembic/`, `flyway/`)
     - ORM models (`models/`, `entities/`, `schemas/`)
     - Database config files (`database.yml`, `ormconfig.json`, etc.)
   - Create a structured inventory of what you found

2. **Identify Database Technologies**
   - PostgreSQL, MySQL, BigQuery, etc.
   - ORM frameworks (SQLAlchemy, TypeORM, Prisma, Django ORM, etc.)
   - Migration tools used

3. **Create Investigation Plan**
   - Use `TodoWrite` to create a task list with:
     - Each repository to investigate
     - Each major database/schema to document
     - Estimated number of tables (update as you learn more)

**Deliverable:** A structured plan showing what you'll investigate and in what order.

---

### Phase 2: Deep Schema Extraction (3-5 hours)

**Objective:** Extract complete schema information for every table.

#### For Each Database/Schema:

**Step 2.1: Find All Tables**
- Search for model definitions, migration files, CREATE TABLE statements
- Build a complete list of tables (don't miss any!)
- Note: Some tables may only appear in migrations, not models (e.g., junction tables)

**Step 2.2: For Each Table, Extract:**

**Basic Information:**
- Table name
- Purpose/description (infer from code comments, variable names, business logic)
- When it was created (check migration timestamps)
- Whether it's actively used (check for recent updates)

**Columns/Fields:**
For each column, document:
- Field name
- Data type (including precision for numerics, length for strings)
- Nullability (NULL/NOT NULL)
- Default values
- Constraints (UNIQUE, CHECK, etc.)
- Indexes (especially important for query performance)
- **Business meaning** - This is critical! Examples:
  - `user_id` → "References the user who performed this action"
  - `created_at` → "Timestamp when the record was first created"
  - `status` → "Enum: 'pending', 'completed', 'failed' - indicates processing state"
  - `metadata` → "JSONB field containing..." (explain structure!)

**JSONB/JSON Fields - CRITICAL:**
When you encounter JSONB/JSON columns:
1. Find example data or factory/seed files
2. Document the schema/structure of nested objects
3. Identify nested arrays and what they contain
4. **Check if nested data references other tables** (e.g., `metadata.campaign_id` might reference `campaigns.id`)
5. Document all possible keys and their meanings

Example:
```
Field: metadata (JSONB)
Structure:
{
  "campaign_id": integer (references campaigns.id),
  "source": string (enum: "web", "mobile", "api"),
  "tags": array of strings,
  "custom_fields": {
    "field_name": "value"
  }
}
```

**Step 2.3: Document Relationships**

**Explicit Relationships (Foreign Keys):**
- Find all foreign key constraints
- Document: `table.column → referenced_table.referenced_column`
- Note the relationship type: one-to-many, many-to-many, one-to-one
- Document ON DELETE/ON UPDATE behaviors

**Implicit Relationships (No FK Constraint):**
Many relationships aren't enforced at the database level. Find these by:
- Searching for JOIN queries in the codebase
- Looking at ORM relationship definitions
- Finding field names that suggest relationships (e.g., `user_id` without FK)
- Checking application code for how data is queried

**Complex Relationships via JSONB:**
CRITICAL: Some relationships are hidden in JSONB fields:
- Example: `events.metadata->>'campaign_id'` might join to `campaigns.id`
- Search for code that extracts JSONB values and joins on them
- Document these as: "JSONB-based relationship: events.metadata->>'campaign_id' references campaigns.id"

**Junction Tables (Many-to-Many):**
- Identify all junction/join tables
- Document what they connect: "user_roles connects users ↔ roles"
- Note any additional metadata columns on the junction table

---

### Phase 3: Business Logic & Semantics (1-2 hours)

**Objective:** Understand what the data **means**, not just its structure.

**Actions:**

1. **Find Query Patterns in Retool**
   - Examine `repos/retool/` for existing SQL queries
   - These show how analysts currently use the data
   - Document common query patterns and what they calculate

2. **Identify Business Entities**
   - Group tables by domain (users, orders, payments, campaigns, etc.)
   - Document the "story" each group tells
   - Example: "The orders domain tracks the complete lifecycle: orders → order_items → payments → fulfillments"

3. **Find Enum Values**
   - Status fields, type fields, category fields
   - Document all possible values and their meanings
   - Check application code for enum definitions

4. **Identify Calculated/Derived Fields**
   - Fields that are computed from other fields
   - Document the calculation logic
   - Example: "total_amount = sum(order_items.price * order_items.quantity)"

5. **Find Soft Deletes**
   - Tables with `deleted_at`, `is_deleted`, `archived_at` fields
   - Document the soft delete pattern used
   - CRITICAL: Queries should usually filter these out!

6. **Temporal Patterns**
   - Created/updated timestamps
   - Valid from/to date ranges
   - Historical tables vs current state tables

---

### Phase 4: Data Flow & ETL Patterns (1 hour)

**Objective:** Understand how data moves and transforms.

**Actions:**

1. **Identify Source Systems**
   - Where does data come from? (APIs, user actions, batch imports)
   - Document data ingestion patterns

2. **Find Transformation Logic**
   - Stored procedures
   - Database triggers
   - Application-level transformations before insert

3. **Identify Aggregate Tables**
   - Pre-computed summaries
   - Materialized views
   - Rollup tables for analytics

---

### Phase 5: Document Production (1-2 hours)

**Objective:** Create clear, comprehensive documentation.

**Required Output Format:**

#### Create: `database-schema-documentation.md`

Structure:
```markdown
# Database Schema Documentation

## Overview
- Database technologies used
- Total tables documented: X
- Last updated: [date]

## Quick Reference
### All Tables (Alphabetical)
- table_name - Brief description

### Tables by Domain
- **Users & Authentication:** users, user_sessions, ...
- **Orders & Commerce:** orders, order_items, payments, ...
- **Analytics & Events:** events, event_properties, ...

---

## Detailed Schema Documentation

### [Domain Name] (e.g., Users & Authentication)

#### Table: users
**Purpose:** Stores all registered user accounts

**Columns:**
| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | bigint | NO | nextval() | Primary key, auto-incrementing user ID |
| email | varchar(255) | NO | - | User's email address, used for login (unique) |
| created_at | timestamp | NO | now() | Account creation timestamp |
| metadata | jsonb | YES | NULL | Additional user properties (see structure below) |

**metadata JSONB Structure:**
```json
{
  "subscription_tier": "free|pro|enterprise",
  "onboarding_completed": boolean,
  "preferences": {
    "language": "en|es|fr|...",
    "timezone": "string"
  }
}
```

**Indexes:**
- PRIMARY KEY: id
- UNIQUE: email
- INDEX: created_at (for date range queries)

**Relationships:**
- users.id → user_sessions.user_id (one-to-many)
- users.id → orders.user_id (one-to-many)

**Query Patterns:**
- Active users: `WHERE deleted_at IS NULL`
- New users this month: `WHERE created_at >= '2025-11-01'`

**Notes:**
- Soft delete: check deleted_at IS NULL
- Email is case-insensitive (enforced by trigger)

---

[Repeat for every table...]
```

#### Create: `relationship-diagram.md`

Visual representation of key relationships:
```markdown
# Database Relationship Diagram

## Core Entity Relationships

### User Domain
```
users (1) ──< (∞) user_sessions
users (1) ──< (∞) orders
users (∞) ><─ (∞) roles  [via user_roles]
```

### Order Flow
```
orders (1) ──< (∞) order_items
orders (1) ──< (∞) payments
orders (1) ──< (1) shipments
```

### Complex JSONB Relationships
```
events.metadata->>'campaign_id' ──> campaigns.id
events.metadata->>'user_id' ──> users.id
```

[Visual diagrams for major data flows...]
```

#### Create: `query-cookbook.md`

Common query patterns for analysts:
```markdown
# SQL Query Cookbook

## User Analytics

### Active Users Count
```sql
SELECT COUNT(*)
FROM users
WHERE deleted_at IS NULL
  AND created_at >= '2025-01-01';
```

### Revenue by User Segment (JSONB example)
```sql
SELECT
  metadata->>'subscription_tier' as tier,
  COUNT(*) as user_count,
  SUM(total_spent) as revenue
FROM users
WHERE deleted_at IS NULL
GROUP BY metadata->>'subscription_tier';
```

[More examples...]
```

#### Create: `data-quality-notes.md`

Document issues, quirks, and gotchas:
```markdown
# Data Quality & Important Notes

## Known Issues
- `orders.status` can be NULL for orders created before 2024-03-01 (migration issue)
- `events.user_id` is NULL for anonymous events

## Important Filters
- ALWAYS filter `deleted_at IS NULL` on: users, orders, products
- ALWAYS filter `is_test = false` on: payments, orders

## Performance Tips
- Use indexes on: user_id, created_at, status fields
- JSONB queries: use `metadata @> '{"key": "value"}'` instead of `->>` for better performance

## Data Quirks
- User IDs < 1000 are internal test accounts
- Negative amounts in payments indicate refunds
```

---

## Tool Usage Guidelines

### Research Phase Tools
- **Glob**: Find all files matching patterns (`**/*.sql`, `**/models/*.py`)
- **Grep**: Search for specific patterns (`CREATE TABLE`, `foreignKey`, `@ManyToOne`)
- **Read**: Read entire files (models, migrations, config files)
- **Bash**: Run commands if needed (`find`, `tree` for directory structure)

### When to Use Sequential Thinking
Use `mcp__mcp_docker__sequentialthinking` when:
- Planning your investigation strategy
- Analyzing complex JSONB structures
- Tracing multi-table relationships
- Resolving conflicting information from different sources

### Task Management
Use `TodoWrite` to:
- Track which repositories you've completed
- Track which tables you've documented
- Keep a running count of progress (e.g., "Documented 45/120 tables")
- Mark tables with complex JSONB that need deeper investigation

---

## Quality Standards

### Thoroughness Checklist
Before marking the task complete, verify:

- [ ] **All repositories in `repos/backend/` investigated**
- [ ] **All repositories in `repos/retool/` investigated for query patterns**
- [ ] **Every table documented** (not just the "important" ones)
- [ ] **All JSONB fields have structure examples**
- [ ] **All relationships documented** (explicit and implicit)
- [ ] **Business meanings documented** for every column
- [ ] **Query examples provided** for common use cases
- [ ] **Data quality issues noted**
- [ ] **No gaps or "TODO" items remaining**

### Documentation Quality
- **Clarity:** A junior data engineer should understand it without asking questions
- **Completeness:** Every table, every column, every relationship
- **Accuracy:** Verify by cross-referencing code, migrations, and actual usage
- **Usefulness:** Include practical query examples, not just theory

---

## Expected Timeline

This is a **multi-hour deep investigation**. Estimated breakdown:
- Phase 1 (Discovery): 30-60 minutes
- Phase 2 (Schema Extraction): 3-5 hours
- Phase 3 (Business Logic): 1-2 hours
- Phase 4 (Data Flow): 1 hour
- Phase 5 (Documentation): 1-2 hours

**Total: 6-10 hours of focused work**

Take breaks as needed. This is marathon work, not a sprint.

---

## Final Deliverables

When you're done, you should have:

1. **database-schema-documentation.md** (main reference)
2. **relationship-diagram.md** (visual relationships)
3. **query-cookbook.md** (common query patterns)
4. **data-quality-notes.md** (gotchas and tips)

Optional but valuable:
5. **investigation-log.md** (your notes, findings, questions that arose)
6. **table-catalog.json** (structured data export for tooling)

---

## Critical Reminders

1. **Be exhaustive** - This is THE definitive reference. If you skip a table, analysts will be stuck.
2. **JSONB is key** - Modern apps store tons of data in JSONB. Don't just say "JSONB field" - document the structure!
3. **Implicit relationships matter** - Not all relationships have foreign keys. Find them anyway.
4. **Think like an analyst** - Document what they need: "How do I calculate revenue?" not just "This is the payments table"
5. **Verify, don't assume** - If you're unsure about a field's meaning, search the codebase for usage
6. **Cross-reference** - Check migrations, models, queries, and application code - they all tell part of the story

---

## How to Begin

1. Start by running: `ls -la repos/` to see what repositories exist
2. Use TodoWrite to create your initial investigation plan
3. Begin Phase 1: Repository Discovery
4. Work systematically through each phase
5. Update your todos as you progress
6. Document as you go - don't try to remember everything until the end

**Remember:** This is a research task, not a coding task. Your output is comprehensive documentation, not code. Focus on accuracy, thoroughness, and clarity.

Good luck! This is important work that will unlock data insights for the entire team.
