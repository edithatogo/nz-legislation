# Glossary & Simplification Guide

**Complex topics explained simply**

---

## 📖 Glossary

**Your guide to technical terms used in this project**

---

### A

**API (Application Programming Interface)**  
*Like a waiter in a restaurant* - You tell the waiter what you want, they take your order to the kitchen, and bring back your food. An API works the same way: you send a request, it fetches data from a server, and brings back the response.

**API Key**  
*Like a password or ID card* - A special code that proves who you are and lets you use the API. Keep it secret, just like your password!

**Authentication**  
*Proving who you are* - The process of checking your API key to make sure you're allowed to access the data.

---

### B

**Batch Processing**  
*Doing things in groups* - Instead of making 100 separate requests one by one, you group them together to be more efficient. Like doing all your laundry at once instead of one sock at a time.

**Burst Limit**  
*Short-term speed limit* - The maximum number of requests you can make in a short time (5 minutes). Think of it like a highway speed limit that prevents traffic jams.

---

### C

**Cache / Caching**  
*Temporary storage for faster access* - Like keeping your favorite snacks in the pantry instead of going to the store every time you're hungry. The tool stores recent API responses so it doesn't have to fetch them again.

**CLI (Command-Line Interface)**  
*Typing commands instead of clicking* - A way to interact with computers by typing text commands instead of using a mouse and buttons.

**CSV (Comma-Separated Values)**  
*Simple table format* - A way to store data in a plain text file where columns are separated by commas. Excel loves these!

---

### D

**Daily Limit**  
*Your daily allowance* - The maximum number of API requests you can make in one day (10,000). Resets at midnight.

---

### E

**Endpoint**  
*A specific address for data* - A URL where the API listens for requests. Like different phone numbers for different departments in a company.

**Export**  
*Saving data to a file* - Taking the search results and saving them to a file (CSV or JSON) that you can open in Excel or other programs.

---

### H

**HTTP**  
*The language of the web* - The protocol computers use to talk to each other over the internet. When you visit a website, you're using HTTP.

---

### J

**JSON (JavaScript Object Notation)**  
*A way to organize data* - A format for storing information that's easy for both humans and computers to read. Looks like a structured list with labels.

**Example:**
```json
{
  "name": "Health Act 2020",
  "type": "act",
  "status": "in-force"
}
```

---

### L

**LRU Cache (Least Recently Used)**  
*Smart memory that forgets old stuff* - A caching system that automatically removes the oldest items when it gets full, like cleaning out your fridge to make room for new groceries.

---

### M

**Module**  
*A self-contained piece of code* - Like a Lego block that does one specific job. You can snap modules together to build bigger things.

---

### N

**Node.js**  
*JavaScript outside the browser* - A program that lets you run JavaScript code on your computer (not just in a web browser). Our tool is built with this.

**npm (Node Package Manager)**  
*An app store for code* - A place where developers can share and download code packages. Like an app store, but for programming tools.

---

### P

**Pagination**  
*Breaking results into pages* - When you get too many results to show at once, they're split into pages. Like Google search results: "Page 1 of 10".

---

### Q

**Query**  
*A search request* - What you're searching for. When you type `--query "health"`, you're asking: "Show me all legislation about health."

---

### R

**Rate Limiting**  
*Speed control* - A system that prevents you from making too many requests too quickly. Like a traffic light that keeps cars from all going at once.

**Repository (Repo)**  
*A project folder* - Where all the code for a project is stored, usually on GitHub. Like a filing cabinet for your project.

---

### S

**Schema**  
*A template for data* - A blueprint that defines what information should look like. Like a form with specific fields you need to fill in.

**Search Parameters**  
*Filters for your search* - Extra options you add to narrow down results, like `--type act` or `--status in-force`.

---

### T

**TypeScript**  
*JavaScript with safety features* - A version of JavaScript that checks for errors before you run the code. Like spell-check, but for programming.

---

### Z

**Zod**  
*A validation tool* - A library that checks if your data matches the expected format. Like a bouncer checking IDs at a club.

---

## 🎓 Explain Like I'm 5 (ELI5)

**Complex topics made super simple**

---

### What is the NZ Legislation Tool?

**ELI5:** It's like a robot librarian for New Zealand laws. You ask it questions, and it finds the answers for you really fast!

**For Kids:** Imagine you have a huge book of rules, and you need to find one specific rule about something. This tool helps you find it without reading the whole book!

---

### What is an API?

**ELI5:** It's like ordering food at a restaurant. You (the customer) tell the waiter (the API) what you want, the waiter tells the kitchen (the server), and brings back your food (the data).

**For Kids:** Remember when you ask Siri or Alexa a question? They're like APIs - they take your question, find the answer, and tell you back!

---

### What is Caching?

**ELI5:** It's like memorizing your friend's phone number instead of looking it up every time you want to call them. Faster, right?

**For Kids:** Imagine you have a favorite toy. Instead of asking your mom where it is every day, you remember it's in your toy box. That's caching!

---

### What is Rate Limiting?

**ELI5:** It's like a speed limit on the highway. It stops you from going too fast and causing accidents (or in this case, overwhelming the server).

**For Kids:** Remember when you're only allowed one cookie per hour? That's rate limiting! It makes sure everyone gets a fair share.

---

### What is a Command-Line Interface?

**ELI5:** It's like talking to a computer by typing instead of clicking. Like texting instead of using buttons.

**For Kids:** Remember when you play Minecraft and type commands like `/give` to get items? That's a command-line interface!

---

### What is JSON?

**ELI5:** It's a way to organize information, like a labeled box for your toys. Each toy has its own spot with a name tag.

**For Kids:** Imagine you have a toy organizer with labels: "Cars", "Dolls", "Blocks". JSON is like that, but for information!

---

### What is a Database?

**ELI5:** It's like a super-organized library where information is stored in neat rows and columns, making it easy to find things.

**For Kids:** Remember how your school has a list of all students with their names, grades, and classes? That's a database!

---

### What is Open Source?

**ELI5:** It's like sharing your LEGO instructions so anyone can build the same thing, improve it, or make something new from it.

**For Kids:** Imagine you draw a picture and let all your friends copy it, change it, or make their own version. That's open source!

---

## 🔧 Simplified Explanations

### How the Tool Works (Simple Version)

1. **You type a command** - Like `nzlegislation search --query "health"`
2. **The tool checks if it remembers** - Looks in its cache (memory)
3. **If not, it asks the API** - Sends your question to the legislation website
4. **The API sends back answers** - Like a librarian bringing you books
5. **The tool shows you results** - Displays them in a nice table
6. **It remembers for next time** - Saves the answer in cache

**Total time:** Usually 1-3 seconds!

---

### Why Do I Need an API Key? (Simple Version)

Think of the API like a members-only club:
- **API Key** = Your membership card
- **Without it** = Sorry, you can't come in!
- **With it** = Welcome! Here's what you can do...

**It's free to join!** Just sign up on their website and they'll email you your key.

---

### What Happens When I Search? (Simple Version)

```
You: "Show me health laws"
  ↓
Tool: "Hmm, let me think..." (checks memory)
  ↓
Tool: "Don't remember, let me ask..." (calls API)
  ↓
API: "Here are 42 results!" (sends data)
  ↓
Tool: "Perfect! Let me make it pretty" (formats)
  ↓
You: See a nice table with all results
```

**The whole thing takes about 2 seconds!**

---

### Why Does It Sometimes Say "Rate Limit Exceeded"? (Simple Version)

Imagine you're at an all-you-can-eat buffet:
- **Normal:** Take food at a reasonable pace ✅
- **Rate Limit:** Don't take 50 plates in 1 minute! ❌

The API has rules to make sure everyone gets fair access:
- **10,000 requests per day** = That's like 416 per hour!
- **2,000 requests per 5 minutes** = Don't go crazy all at once

**If you hit the limit:** Just wait a bit and try again. The limit resets automatically!

---

## 📝 Common Analogies

### API is Like...

| Technical Term | Real-World Analogy |
|---------------|-------------------|
| **API** | Waiter at a restaurant |
| **API Key** | Password or ID card |
| **Endpoint** | Phone number for a department |
| **Request** | Placing an order |
| **Response** | Getting your food |
| **Rate Limit** | Speed limit on highway |
| **Cache** | Memorizing phone numbers |
| **Database** | Organized library |
| **Query** | Search question |
| **Export** | Saving to a file |

---

## 🎯 Quick Reference for Non-Technical Users

### I Just Want to Search...

**Read this:** [Quick Start Guide](../../README.md#-quick-start-5-minutes) (5 minutes)

### I Need to Export Data...

**Read this:** [Export Guide](./user-guide/research-workflow.md#stage-2-data-collection) (3 minutes)

### I Want to Cite Legislation...

**Read this:** [Citation Guide](./user-guide/research-workflow.md#stage-4-citation--writing) (2 minutes)

### Something's Not Working...

**Read this:** [Troubleshooting Guide](./user-guide/troubleshooting.md) (find your error)

### I'm Still Confused...

**Try this:** [FAQ](./user-guide/faq.md) (36 questions answered)

---

## 🤔 Frequently Confused Terms

### API vs. CLI

- **API** = The service that provides data (like a library)
- **CLI** = The tool you use to access the data (like a librarian)

**You use the CLI to talk to the API!**

---

### Cache vs. Export

- **Cache** = Temporary memory (deleted automatically)
- **Export** = Permanent file (saved until you delete it)

**Cache is for speed, Export is for keeping!**

---

### Search vs. Get

- **Search** = Find many things (like browsing)
- **Get** = Find one specific thing (like asking for a specific book)

**Use Search to explore, Get to retrieve!**

---

### JSON vs. CSV

- **JSON** = For computers (structured, detailed)
- **CSV** = For humans (opens in Excel)

**Use JSON for code, CSV for spreadsheets!**

---

## 📚 Learning Path

### For Complete Beginners

1. Start with [ELI5 sections](#explain-like-im-5-eli5)
2. Read [Quick Start Guide](../../README.md#-quick-start-5-minutes)
3. Try your first search
4. Check [FAQ](./user-guide/faq.md) when stuck

### For Non-Technical Researchers

1. Read [Glossary](#-glossary) (focus on A, C, E, Q, S)
2. Follow [Research Workflow](./user-guide/research-workflow.md)
3. Use [Troubleshooting Guide](./user-guide/troubleshooting.md) as needed

### For Developers

1. Skip to [Architecture](./architecture.md)
2. Review [API Reference](./api-reference/)
3. Check [Contributing Guide](./contributing.md)

---

## 💡 Tips for Understanding

### When You See a Technical Term...

1. **Check the Glossary** - Is it defined here?
2. **Look for Analogies** - What real-world thing is it like?
3. **Find Examples** - How is it used in practice?
4. **Ask "Why?"** - Why does this exist? What problem does it solve?

### When Something's Confusing...

1. **Break it Down** - What are the individual parts?
2. **Find the Simple Version** - Check ELI5 section
3. **Look for Diagrams** - [Visual Diagrams](./visual-diagrams.md) might help
4. **Try It Yourself** - Sometimes doing helps understanding

---

**Last Updated:** 2026-03-10  
**Version:** 1.0.0  
**Track:** Documentation Optimization & Humanization  
**Phase:** 6 - Simplification & Humanization
