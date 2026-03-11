# Data Models

This document describes the core data models used in the NZ Legislation Tool.

## Work

The primary data structure representing a piece of legislation.

```typescript
interface Work {
  work_id: string;              // Unique identifier
  legislation_type: string;     // 'Act' or 'Regulation'
  legislation_status: string | null;
  latest_matching_version?: {
    title: string;
    version_id: string;
    formats: Array<{
      type: string;  // 'html', 'pdf', 'xml'
      url: string;
    }>;
  };
}
```

## Version

Represents a specific version of a work.

```typescript
interface Version {
  version_id: string;
  title: string;
  date: string;
  status: string;
  formats: Array<{
    type: string;
    url: string;
  }>;
}
```

## Search Results

```typescript
interface SearchResults {
  works: Work[];
  total: number;
  limit: number;
  offset: number;
}
```

## Export Formats

### CSV Format
```csv
work_id,legislation_type,title,status,url
act_public_1989_18,Act,Health Act 1956,Repealed,https://...
```

### JSON Format
```json
{
  "works": [...],
  "total": 100,
  "limit": 10,
  "offset": 0
}
```

## Zod Schemas

Runtime validation using Zod:

```typescript
import { z } from 'zod';

const WorkSchema = z.object({
  work_id: z.string(),
  legislation_type: z.enum(['Act', 'Regulation']),
  legislation_status: z.string().nullable(),
  latest_matching_version: z.object({
    title: z.string(),
    version_id: z.string(),
    formats: z.array(z.object({
      type: z.string(),
      url: z.string().url(),
    })),
  }).optional(),
});

export type Work = z.infer<typeof WorkSchema>;
```

## Error Models

```typescript
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

interface ValidationError {
  field: string;
  message: string;
  value?: any;
}
```

---

**Related:**
- [Client API](./client.md)
- [Error Reference](../troubleshooting/error-reference.md)
- [Developer Guide](../developer-guide/index.md)
