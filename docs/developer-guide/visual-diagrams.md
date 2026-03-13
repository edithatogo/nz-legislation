# Visual Documentation

**Architecture diagrams, flowcharts, and visual guides for the NZ Legislation Tool**

---

## System Architecture

### High-Level Architecture

This diagram shows the overall system architecture and data flow.

```mermaid
graph TB
    User[User / CLI] --> CLILayer[CLI Layer<br/>commander]

    subgraph "Application Layer"
        CLILayer --> SearchCmd[search command]
        CLILayer --> GetCmd[get command]
        CLILayer --> ExportCmd[export command]
        CLILayer --> CiteCmd[cite command]

        SearchCmd --> APIClient[API Client Layer<br/>got + caching]
        GetCmd --> APIClient
        ExportCmd --> APIClient
        CiteCmd --> APIClient
    end

    APIClient --> RateLimiter[Rate Limiter<br/>10K/day, 2K/5min]
    RateLimiter --> Cache[LRU Cache<br/>500 entries]
    Cache --> HTTPClient[HTTP Client<br/>got]

    HTTPClient --> NZAPI[NZ Legislation API<br/>api.legislation.govt.nz]

    APIClient --> Models[Models Layer<br/>Zod schemas]
    Models --> Output[Output Layer<br/>Table/JSON/CSV]

    Output --> User

    style User fill:#e1f5ff
    style NZAPI fill:#fff4e1
    style Output fill:#e8f5e9
```

---

## Data Flow Diagrams

### Search Command Flow

```mermaid
sequenceDiagram
    participant U as User
    participant CLI as CLI Parser
    participant SC as searchWorks()
    participant Cache as Cache
    participant RL as Rate Limiter
    participant HTTP as HTTP Client
    participant API as NZ API
    participant Models as Zod Validation
    participant Out as Output Formatter

    U->>CLI: nzlegislation search --query "health"
    CLI->>SC: searchWorks({query: "health"})

    SC->>Cache: Check cache
    alt Cache Hit
        Cache-->>SC: Return cached results
    else Cache Miss
        Cache-->>SC: Not found
        SC->>RL: Check rate limit
        RL-->>SC: OK
        SC->>HTTP: GET /v0/works?q=health
        HTTP->>API: HTTP Request
        API-->>HTTP: JSON Response
        HTTP-->>SC: Response data
        SC->>Cache: Store in cache
    end

    SC->>Models: Validate with Zod
    Models-->>SC: Validated data
    SC->>Out: Format output
    Out-->>U: Display results
```

---

### Configuration Flow

```mermaid
flowchart TD
    Start[Application Start] --> LoadEnv[Load Environment Variables<br/>dotenv.config()]
    LoadEnv --> LoadConfig[Load Config File<br/>conf.get()]
    LoadConfig --> Merge[Merge Configuration<br/>Env > File > Defaults]
    Merge --> Validate{Validate with<br/>Zod Schema}

    Validate -->|Valid| Ready[Ready to Use<br/>export getConfig()]
    Validate -->|Invalid| Error[Error: Invalid Config<br/>throw ConfigError]

    style Start fill:#e1f5ff
    style Ready fill:#e8f5e9
    style Error fill:#ffebee
```

---

### Error Handling Flow

```mermaid
flowchart TD
    Start[Command Execution] --> Try[Try Block<br/>Execute Command]
    Try --> CheckError{Error?}

    CheckError -->|No Error| Success[Success<br/>Display Output]
    CheckError -->|Error| Catch[Catch Error<br/>Capture Details]

    Catch --> MapError[Map to Error Code<br/>Add Suggestion]
    MapError --> DisplayErr[Display Error<br/>User-Friendly Message]

    DisplayErr --> CheckType{Error Type?}
    CheckType -->|ConfigError| ConfigHelp[Show Config Help<br/>nzlegislation config --key]
    CheckType -->|ApiError| APIHelp[Show API Help<br/>Check API key/status]
    CheckType -->|NetworkError| NetHelp[Show Network Help<br/>Check connection]
    CheckType -->|ValidationError| ValHelp[Show Validation Help<br/>Check format]

    ConfigHelp --> End[End]
    APIHelp --> End
    NetHelp --> End
    ValHelp --> End
    Success --> End

    style Start fill:#e1f5ff
    style Success fill:#e8f5e9
    style End fill:#f5f5f5
```

---

## Component Architecture

### Module Dependencies

```mermaid
graph LR
    subgraph "CLI Layer"
        CLI[cli.ts]
        Search[commands/search.ts]
        Get[commands/get.ts]
        Export[commands/export.ts]
        Cite[commands/cite.ts]
        Config[commands/config.ts]
    end

    subgraph "Core Layer"
        Client[client.ts]
        ConfigCore[config.ts]
        Errors[errors.ts]
    end

    subgraph "Support Layer"
        Models[models/]
        Output[output/]
        Utils[utils/]
    end

    CLI --> Search
    CLI --> Get
    CLI --> Export
    CLI --> Cite
    CLI --> Config

    Search --> Client
    Get --> Client
    Export --> Client
    Cite --> Client
    Config --> ConfigCore

    Client --> Models
    Client --> Output
    Config --> ConfigCore

    Client --> Utils

    style CLI fill:#e1f5ff
    style Client fill:#fff4e1
    style Models fill:#e8f5e9
```

---

### Data Model Relationships

```mermaid
classDiagram
    class Work {
        +string id
        +string title
        +string shortTitle
        +string type
        +string status
        +string date
        +string url
        +number versionCount
    }

    class SearchParams {
        +string query
        +string type
        +string status
        +string from
        +string to
        +number limit
        +number offset
    }

    class SearchResults {
        +number total
        +number offset
        +number limit
        +Work[] works
    }

    class Citation {
        +string style
        +string workId
        +string formatted
    }

    class Config {
        +string apiKey
        +string baseUrl
        +number timeout
        +number dailyLimit
        +number burstLimit
    }

    SearchParams --> SearchResults : produces
    Work --> SearchResults : contained in
    Work --> Citation : generates
    Config --> SearchParams : configures

    style Work fill:#e1f5ff
    style SearchResults fill:#fff4e1
    style Citation fill:#e8f5e9
```

---

## Testing Architecture

### Test Pyramid

```mermaid
graph BT
    E2E[E2E Tests<br/>~10 tests<br/>Full CLI workflows] --> Unit[Unit Tests<br/>~10 tests<br/>Core logic]
    Prop[Property Tests<br/>~10 tests<br/>Invariant testing] --> Unit
    Hypo[Hypothesis Tests<br/>~8 tests<br/>Reproducibility] --> Unit
    Int[Integration Tests<br/>~5 tests<br/>API mocking] --> Unit

    style Unit fill:#e8f5e9
    style Int fill:#fff4e1
    style Prop fill:#e1f5ff
    style Hypo fill:#e1f5ff
    style E2E fill:#ffebee
```

---

### Test Execution Flow

```mermaid
flowchart LR
    Start[Run npm test] --> Vitest[Vitest Test Runner]
    Vitest --> Discover[Discover Test Files]
    Discover --> Parallel[Run Tests in Parallel]

    Parallel --> Unit[Unit Tests]
    Parallel --> Int[Integration Tests]
    Parallel --> E2E[E2E Tests]
    Parallel --> Prop[Property Tests]
    Parallel --> Hypo[Hypothesis Tests]

    Unit --> Report[Generate Report]
    Int --> Report
    E2E --> Report
    Prop --> Report
    Hypo --> Report

    Report --> Coverage[Coverage Report<br/>lcov, text]
    Coverage --> Exit{All Pass?}

    Exit -->|Yes| Success[✅ Success]
    Exit -->|No| Fail[❌ Failure]

    style Start fill:#e1f5ff
    style Success fill:#e8f5e9
    style Fail fill:#ffebee
```

---

## Performance Architecture

### Caching Strategy

```mermaid
flowchart TD
    Request[API Request] --> CheckCache{Check Cache}

    CheckCache -->|Hit| ReturnCache[Return Cached<br/>Update LRU]
    CheckCache -->|Miss| CheckLimit{Check Rate Limit}

    CheckLimit -->|Exceeded| Error[Error: Rate Limit<br/>Wait and Retry]
    CheckLimit -->|OK| MakeRequest[Make HTTP Request]

    MakeRequest --> Response[Receive Response]
    Response --> Validate{Validate with Zod}

    Validate -->|Valid| CacheStore[Store in Cache<br/>Set TTL]
    Validate -->|Invalid| ThrowErr[Throw ValidationError]

    CacheStore --> Return[Return Data]
    ReturnCache --> Return
    Error --> Return

    style Request fill:#e1f5ff
    style Return fill:#e8f5e9
    style Error fill:#ffebee
```

### Rate Limiting Strategy

```mermaid
stateDiagram-v2
    [*] --> Idle: Start

    Idle --> Checking: Request Received
    Checking --> BurstOK: Burst < 2000?
    Checking --> BurstWait: Burst >= 2000

    BurstOK --> DailyOK: Daily < 10000?
    BurstOK --> BurstWait: Daily >= 10000

    DailyOK --> Execute: Execute Request
    DailyOK --> DailyWait: Daily >= 10000

    Execute --> Increment: Increment Counters
    Increment --> Checking: Next Request

    BurstWait --> Wait5Min: Wait 5 Minutes
    DailyWait --> WaitMidnight: Wait Until Midnight

    Wait5Min --> ResetBurst: Reset Burst Counter
    ResetBurst --> Checking

    WaitMidnight --> ResetDaily: Reset Daily Counter
    ResetDaily --> Checking

    style Idle fill:#e8f5e9
    style Execute fill:#e8f5e9
    style BurstWait fill:#fff4e1
    style DailyWait fill:#fff4e1
    style Error fill:#ffebee
```

---

## Security Architecture

### API Key Flow

```mermaid
flowchart TD
    Start[Application Start] --> CheckEnv{Check Env Var?}

    CheckEnv -->|Set| UseEnv[Use NZ_LEGISLATION_API_KEY]
    CheckEnv -->|Not Set| CheckFile{Check Config File?}

    CheckFile -->|Exists| LoadFile[Load from config.json]
    CheckFile -->|Not Exists| Error[Error: No API Key<br/>Run: nzlegislation config --key]

    UseEnv --> Validate{Validate Format?}
    LoadFile --> Validate

    Validate -->|Valid| Mask[Mask for Display<br/>nzlapi...8911]
    Validate -->|Invalid| ConfigErr[Error: Invalid Format<br/>Re-run config command]

    Mask --> Ready[Ready to Use]
    ConfigErr --> Fix[Fix Configuration]
    Fix --> CheckEnv

    Error --> Fix

    style Start fill:#e1f5ff
    style Ready fill:#e8f5e9
    style Error fill:#ffebee
```

---

## User Workflows

### First-Time User Flow

```mermaid
flowchart TD
    Start[New User] --> Discover[Discover Tool<br/>GitHub/npm]
    Discover --> ReadME[Read README]
    ReadME --> Decide{Install?}

    Decide -->|Yes, Try First| NPX[Try with npx<br/>No install]
    Decide -->|Yes, Regular Use| NPM[Install with npm<br/>npm install -g]
    Decide -->|No| Leave[Leave]

    NPX --> GetKey[Get API Key<br/>api.legislation.govt.nz]
    NPM --> GetKey

    GetKey --> Config[Configure<br/>nzlegislation config --key]
    Config --> Test[Test<br/>nzlegislation search --query "health"]

    Test --> Success{Works?}
    Success -->|Yes| FirstSearch[First Successful Search]
    Success -->|No| Troubleshoot[Troubleshooting<br/>Check FAQ/docs]

    Troubleshoot --> Retry[Retry Configuration]
    Retry --> Test

    FirstSearch --> Export[Export Results]
    Export --> Cite[Generate Citation]
    Cite --> Regular[Regular User]

    style Start fill:#e1f5ff
    style Regular fill:#e8f5e9
    style Troubleshoot fill:#fff4e1
    style Leave fill:#f5f5f5
```

---

### Research Workflow

```mermaid
flowchart LR
    subgraph "Stage 1: Discovery"
        S1[Initial Search] --> Refine[Refine Search]
        Refine --> Review[Review Results]
    end

    subgraph "Stage 2: Data Collection"
        Review --> Export[Export Dataset]
        Export --> Details[Get Details]
        Details --> Batch[Batch Export]
    end

    subgraph "Stage 3: Analysis"
        Batch --> Excel[Open in Excel]
        Excel --> R[Analyze in R]
        R --> Python[Analyze in Python]
    end

    subgraph "Stage 4: Citation"
        Python --> CiteNZMJ[Cite NZMJ]
        CiteNZMJ --> CiteAPA[Cite APA]
        CiteAPA --> BibTeX[Cite BibTeX]
    end

    BibTeX --> Paper[Write Paper]

    style S1 fill:#e1f5ff
    style Export fill:#fff4e1
    style Excel fill:#e8f5e9
    style Paper fill:#f3e5f5
```

---

## Troubleshooting Flowcharts

### API Key Issues

```mermaid
flowchart TD
    Start[API Key Error] --> CheckMsg{Error Message?}

    CheckMsg -->|"API key not configured"| NotConfig[Run: nzlegislation config --key]
    CheckMsg -->|"Authentication failed"| AuthFail[Check API Key]
    CheckMsg -->|"Rate limit exceeded"| RateLimit[Wait & Retry]

    NotConfig --> EnterKey[Enter API Key]
    EnterKey --> Test[Test: search --query "test"]

    AuthFail --> FindEmail[Find Original Email]
    FindEmail --> CopyKey[Copy Key Carefully]
    CopyKey --> Reconfig[Run: config --key NEW_KEY]
    Reconfig --> Test

    RateLimit --> Wait5[Wait 5 Minutes]
    Wait5 --> Retry[Retry Request]

    Test --> Success{Works?}
    Success -->|Yes| Done[✅ Done]
    Success -->|No| Contact[Contact Support<br/>GitHub Issues]

    Retry --> Success

    style Start fill:#ffebee
    style Done fill:#e8f5e9
    style Contact fill:#fff4e1
```

---

### Installation Issues

```mermaid
flowchart TD
    Start[Installation Error] --> CheckNode{Node.js Installed?}

    CheckNode -->|No| InstallNode[Install Node.js 18+<br/>nodejs.org]
    CheckNode -->|Yes| CheckNPM{npm works?}

    InstallNode --> VerifyNode[Verify: node --version]
    VerifyNode --> CheckNPM

    CheckNPM -->|No| ReinstallNPM[Reinstall Node.js]
    CheckNPM -->|Yes| TryInstall[Try: npm install -g]

    ReinstallNPM --> TryInstall

    TryInstall --> Success{Success?}
    Success -->|Yes| Verify[Verify: nzlegislation --version]
    Success -->|No| CheckPerm{Permission Error?}

    CheckPerm -->|Yes| Sudo[Try: sudo npm install -g<br/>or fix permissions]
    CheckPerm -->|No| CheckNet{Network Error?}

    Sudo --> Verify
    CheckNet -->|Yes| CheckConnection[Check Internet<br/>Try: ping npmjs.org]
    CheckNet -->|No| OtherErr[Other Error<br/>Check logs]

    CheckConnection --> Retry[Retry Installation]
    Retry --> TryInstall

    OtherErr --> GitHub[Open GitHub Issue<br/>Include error message]

    Verify --> Done[✅ Done]

    style Start fill:#ffebee
    style Done fill:#e8f5e9
    style GitHub fill:#fff4e1
```

---

## Deployment Architecture

### CI/CD Pipeline

```mermaid
graph LR
    Push[Git Push] --> Trigger{Trigger?}

    Trigger -->|Push to main| FullPipeline[Full Pipeline]
    Trigger -->|Pull Request| PRPipeline[PR Pipeline]
    Trigger -->|Version Tag| ReleasePipeline[Release Pipeline]

    subgraph "Full Pipeline"
        FullPipeline --> Lint[Lint<br/>ESLint + TypeScript]
        Lint --> Test[Test<br/>Vitest Node 18,20,22]
        Test --> Build[Build<br/>TypeScript compilation]
        Build --> Coverage[Coverage Report]
    end

    subgraph "PR Pipeline"
        PRPipeline --> PRLint[Lint]
        PRLint --> PRTest[Test]
        PRTest --> PRBuild[Build]
    end

    subgraph "Release Pipeline"
        ReleasePipeline --> ReleaseTest[Test]
        ReleaseTest --> ReleaseBuild[Build]
        ReleaseBuild --> Publish[npm publish]
        Publish --> GitHubRel[GitHub Release]
    end

    style Push fill:#e1f5ff
    style Publish fill:#e8f5e9
    style GitHubRel fill:#f3e5f5
```

---

## Accessibility Notes

All diagrams are designed with accessibility in mind:

- **Text alternatives:** Each diagram includes a text description
- **Color contrast:** High contrast colors for visibility
- **Simple shapes:** Easy to parse for screen readers
- **Logical flow:** Clear start and end points
- **Consistent styling:** Predictable visual patterns

For users with screen readers, the text descriptions below each diagram provide the same information as the visual representation.

---

**Last Updated:** 2026-03-10  
**Version:** 1.0.0  
**Track:** Documentation Optimization & Humanization  
**Phase:** 5 - Visual Documentation
