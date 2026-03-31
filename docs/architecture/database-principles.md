# Database Principles

- Use normalized tables for core entities.
- Use JSONB only for flexible secondary payloads, not core relational logic.
- Every important operational change should be historically logged.
- Include created_at and updated_at on every app-owned table.
- Include created_by where operationally relevant.
- Support multi-location architecture from the beginning.
- Prefer join tables over array fields when relationships matter.
- Add row level security policies from the start, even if simple at first.
