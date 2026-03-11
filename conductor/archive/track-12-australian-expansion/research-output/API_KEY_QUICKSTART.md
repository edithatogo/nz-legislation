# Australian API Key Quick-Start Guide

**Purpose:** Step-by-step instructions for obtaining API keys for Australian legislation APIs  
**Track:** Track 12 - Australian Legislation API Integration  
**Last Updated:** 2026-03-10

---

## Priority 1: Commonwealth (Federal) API Key ⭐⭐⭐⭐⭐

**Status:** ✅ **IMMEDIATE ACCESS AVAILABLE**  
**Time Required:** 5-10 minutes  
**Cost:** FREE

### Step-by-Step Registration

#### Step 1: Visit Registration Page

**URL:** https://www.legislation.gov.au/sign-up

#### Step 2: Fill Registration Form

**Required Information:**
```
Email Address: [your-email@example.com]
Password: [create secure password]
Confirm Password: [confirm password]
First Name: [your first name]
Last Name: [your last name]
```

**Optional Information:**
```
Organization: [optional - can leave blank or add "Independent Research"]
Phone: [optional]
```

#### Step 3: Verify Email

1. Check email inbox for verification email
2. Subject: "Verify your email - Federal Register of Legislation"
3. Click verification link
4. Email verified ✅

#### Step 4: Log In

1. Return to https://www.legislation.gov.au/sign-in
2. Enter email and password
3. Log in successfully ✅

#### Step 5: Access API Section

1. Click on your name (top right)
2. Select "My Account" or "API Access"
3. Navigate to API section
4. View/generate API key

#### Step 6: Generate API Key

1. Click "Generate API Key" or "Create New Key"
2. Copy API key immediately
3. Store securely (password manager, environment variable)
4. **Important:** API key shown only once!

#### Step 7: Test API Key

**Test Endpoint:**
```bash
curl "https://api.prod.legislation.gov.au/v1/search?query=privacy&apikey=YOUR_API_KEY"
```

**Expected Response:**
```json
{
  "total": 15,
  "results": [
    {
      "id": "act/2024/123",
      "title": "Privacy Act 1988",
      ...
    }
  ]
}
```

### API Key Storage

**Recommended Methods:**

1. **Environment Variable** (Recommended for development)
```bash
# Add to .env file
COMMONWEALTH_API_KEY=your_api_key_here

# Or export in shell
export COMMONWEALTH_API_KEY=your_api_key_here
```

2. **Configuration File** (For production)
```json
{
  "apis": {
    "commonwealth": {
      "key": "your_api_key_here",
      "baseUrl": "https://api.prod.legislation.gov.au/v1/"
    }
  }
}
```

3. **Password Manager** (For secure storage)
- 1Password
- LastPass
- Bitwarden
- KeePass

### Rate Limits

| Limit | Value | Notes |
|-------|-------|-------|
| **Requests/Minute** | 60 | 1 request per second |
| **Requests/Day** | 10,000 | ~277 requests/hour |
| **Burst** | 100 | Short bursts allowed |

### Troubleshooting

**Problem:** API key not working  
**Solution:**
1. Verify key copied correctly (no spaces)
2. Check API key not expired
3. Contact support: legislation.gov.au contact form

**Problem:** Rate limit exceeded  
**Solution:**
1. Wait 1 minute
2. Implement exponential backoff
3. Cache responses

**Problem:** 404 Not Found  
**Solution:**
1. Check API endpoint URL
2. Verify legislation ID format
3. Check API documentation

### Contact Support

**Website:** https://www.legislation.gov.au/help-and-resources  
**Contact Form:** https://www.legislation.gov.au/help-and-resources/using-the-legislation-register/feedback  
**Phone:** 1300 657 423 (within Australia)

---

## Priority 2: Queensland API Key ⭐⭐⭐⭐

**Status:** ⚠️ **REQUIRES EMAIL REQUEST**  
**Time Required:** 1-3 business days (response time)  
**Cost:** Likely FREE

### Step-by-Step Request

#### Step 1: Prepare Email

**To:** opc@opc.qld.gov.au  
**Subject:** API Access Request for Research Project

#### Step 2: Write Email

**Template:**
```
Dear Office of the Queensland Parliamentary Counsel,

I am developing a research tool for accessing Australian legislation 
and would like to request API access to Queensland legislation.

Project Details:
- Name: NZ Legislation Tool (expanding to Australia)
- Purpose: Research and academic access to Australian legislation
- Expected Usage: [estimate, e.g., 100 requests/day]
- Use Case: Researchers, legal professionals, academics

Request:
1. API documentation for Queensland Legislation
2. API key or authentication process
3. Rate limits and usage terms
4. Licensing information

This tool will provide free access to Australian legislation for 
research purposes, similar to existing tools for NZ legislation.

Thank you for your assistance.

Best regards,
[Your Name]
[Your Organization (if any)]
[Email Address]
[Phone Number (optional)]
```

#### Step 3: Send Email

1. Send to opc@opc.qld.gov.au
2. Wait for response (1-3 business days)
3. Follow up if no response after 5 business days

#### Step 4: Follow Up Template

**If no response after 5 days:**
```
Dear OPC Queensland Team,

I'm following up on my API access request sent on [date].

I'm developing a research tool for Australian legislation and 
would appreciate access to Queensland legislation API documentation 
and authentication details.

Original request details:
- Purpose: Research tool for legislation access
- Expected usage: [your estimate]
- Contact: [your email]

Please let me know if you need any additional information.

Thank you,
[Your Name]
```

#### Step 5: Receive API Access

**Expected Response:**
```
Dear [Your Name],

Thank you for your interest in Queensland Legislation.

API Access Details:
- Base URL: https://www.legislation.qld.gov.au/api/
- API Key: [your_key]
- Rate Limits: [limits]
- Documentation: [attached or link]

Terms of Use:
- Free for research/non-commercial use
- Attribution required
- Rate limits apply

Please contact us if you have any questions.

Best regards,
OPC Queensland Team
```

#### Step 6: Test API Access

**Test Endpoint:**
```bash
curl "https://www.legislation.qld.gov.au/api/acts?apikey=YOUR_API_KEY"
```

### Alternative Contact Methods

**Phone:**
```
+61 7 3003 9200
Hours: 9:00 AM - 5:00 PM AEST (Monday-Friday)
```

**Mail:**
```
Office of the Queensland Parliamentary Counsel
80 Ann Street
Brisbane QLD 4000
Australia
```

**Website Contact Form:**
```
https://www.legislation.qld.gov.au/contact-us/
```

---

## Priority 3: NSW API Access ⭐⭐⭐

**Status:** ❓ **UNKNOWN - REQUIRES INQUIRY**  
**Time Required:** 1-5 business days  
**Cost:** Unknown

### Contact Information

**Email:** pco@pco.nsw.gov.au  
**Phone:** +61 2 9228 1700  
**Website:** https://www.legislation.nsw.gov.au/

### Email Template

```
Dear NSW Parliamentary Counsel's Office,

I am developing a research tool for accessing Australian legislation 
and would like to inquire about API access to NSW legislation.

Could you please provide information on:
1. Is there an API available for NSW legislation?
2. If yes, how do I obtain API access?
3. What are the terms of use and licensing?
4. Are there rate limits or usage restrictions?

Project: Research tool for legislation access
Usage: Academic/research purposes
Expected volume: [estimate]

Thank you for your assistance.

Best regards,
[Your Name]
[Contact Information]
```

---

## Priority 4: Victoria API Access ⭐⭐⭐

**Status:** ❓ **UNKNOWN - REQUIRES INQUIRY**  
**Time Required:** 1-5 business days  
**Cost:** Unknown

### Contact Information

**Email:** legislation@justice.vic.gov.au  
**Phone:** +61 3 9651 2200  
**Website:** https://www.legislation.vic.gov.au/

### Email Template

```
Dear Victorian Parliamentary Counsel,

I am developing a research tool for accessing Australian legislation 
and would like to inquire about API access to Victorian legislation.

Could you please provide information on:
1. API availability
2. Access requirements
3. Terms of use
4. Rate limits

Project: Research tool for legislation access
Usage: Academic/research purposes

Thank you for your assistance.

Best regards,
[Your Name]
[Contact Information]
```

---

## Tracking Template

Use this template to track API key requests:

| Jurisdiction | Contact Date | Response Date | API Key Received | Status | Notes |
|--------------|-------------|---------------|------------------|--------|-------|
| **Commonwealth** | 2026-03-10 | - | - | ⏳ Pending | Register online |
| **Queensland** | [date] | - | - | ⏳ Pending | Email sent |
| **NSW** | [date] | - | - | ⏳ Pending | Inquiry sent |
| **Victoria** | [date] | - | - | ⏳ Pending | Inquiry sent |

---

## API Key Security Best Practices

### DO ✅

- ✅ Store API keys in environment variables
- ✅ Use password managers for secure storage
- ✅ Rotate keys periodically (every 6-12 months)
- ✅ Monitor API usage for anomalies
- ✅ Use separate keys for development/production
- ✅ Revoke compromised keys immediately

### DON'T ❌

- ❌ Commit API keys to Git repositories
- ❌ Share API keys via email/chat
- ❌ Hardcode API keys in source code
- ❌ Use API keys in client-side code
- ❌ Reuse API keys across different services

---

## Quick Reference

### API Key Registration URLs

| Jurisdiction | URL | Time | Cost |
|--------------|-----|------|------|
| **Commonwealth** | https://www.legislation.gov.au/sign-up | 5-10 min | FREE |
| **Queensland** | Email: opc@opc.qld.gov.au | 1-3 days | Likely FREE |
| **NSW** | Email: pco@pco.nsw.gov.au | 1-5 days | Unknown |
| **Victoria** | Email: legislation@justice.vic.gov.au | 1-5 days | Unknown |

### Test Commands

**Commonwealth:**
```bash
curl "https://api.prod.legislation.gov.au/v1/search?query=privacy&apikey=YOUR_KEY"
```

**Queensland:**
```bash
curl "https://www.legislation.qld.gov.au/api/acts?apikey=YOUR_KEY"
```

---

## Next Steps

### Immediate (Today)

1. ✅ Register for Commonwealth API key
   - URL: https://www.legislation.gov.au/sign-up
   - Time: 5-10 minutes
   - Test immediately

2. ✅ Send Queensland API request email
   - To: opc@opc.qld.gov.au
   - Use template above
   - Expect response in 1-3 days

### This Week

3. ⏳ Send NSW inquiry email
4. ⏳ Send Victoria inquiry email
5. ⏳ Test Commonwealth API thoroughly
6. ⏳ Document all API responses

### Next Week

7. ⏳ Follow up on Queensland (if no response)
8. ⏳ Review all API documentation received
9. ⏳ Plan integration architecture
10. ⏳ Create implementation timeline

---

**Guide Version:** 1.0  
**Last Updated:** 2026-03-10  
**Track:** Track 12 - Australian Legislation API Integration  
**Status:** READY FOR USE
