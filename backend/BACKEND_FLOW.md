# Better Title - Backend Architecture & Flow Documentation

## 🎯 Project Overview

**Better Title** is an AI-powered YouTube video title enhancement service that helps content creators optimize their video titles for better engagement and discoverability. The backend automatically fetches a channel's latest videos, enhances their titles using Google's Gemini AI, and delivers a professional comparison report via email.

---

## 🏗️ Architecture Stack

### Technologies Used

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js v5
- **AI Service**: Google Gemini 2.5 Flash (via @google/genai)
- **Email Service**: Resend API
- **External API**: YouTube Data API v3
- **HTTP Client**: Axios
- **Environment Management**: dotenv

### Project Structure

```
better-title/
├── src/
│   ├── index.js                      # Express server entry point
│   ├── controllers/
│   │   ├── yt.controller.js          # YouTube API integration & orchestration
│   │   ├── gemini.controller.js      # AI title enhancement logic
│   │   └── resend.controller.js      # Professional email generation & sending
│   ├── routes/
│   │   └── youtube.route.js          # API route definitions
│   ├── middlewares/                  # (Future middleware)
│   ├── utils/                        # (Future utilities)
│   └── db/                           # (Future database integration)
├── package.json
└── .env                              # Environment variables
```

---

## 🔄 Complete Application Flow

### Step-by-Step Execution Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         1. CLIENT REQUEST                            │
│  POST /api/youtube/channel-id                                        │
│  Body: { "name": "ChannelName", "email": "user@example.com" }       │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    2. YOUTUBE CHANNEL SEARCH                         │
│  • Controller: getYoutubeId()                                        │
│  • Validates request (name & email required)                         │
│  • Searches YouTube API for channel by name                          │
│  • Extracts channelId from search results                            │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 3. FETCH LATEST 5 VIDEOS                             │
│  • Function: latestVideos(channelId)                                 │
│  • Calls YouTube API with channelId                                  │
│  • Retrieves 5 most recent videos ordered by date                    │
│  • Extracts video titles into array                                  │
│  • Returns: ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"] │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│               4. AI TITLE ENHANCEMENT (GEMINI)                       │
│  • Function: titleEnhance(titlesArray)                               │
│  • Sends titles to Google Gemini 2.5 Flash model                     │
│  • Prompt: "Give better titles, add @ after each"                    │
│  • AI generates enhanced, SEO-optimized titles                       │
│  • Response format: "Better Title 1@Better Title 2@Better Title 3@"  │
│  • Parses response by splitting on '@' delimiter                     │
│  • Normalizes HTML entities (&amp; → &)                              │
│  • Returns: ["Enhanced 1", "Enhanced 2", "Enhanced 3", ...]         │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│           5. PROFESSIONAL EMAIL GENERATION & DELIVERY                │
│  • Function: sendTitles(oldTitles, newTitles, email)                 │
│  • Builds HTML table comparing old vs new titles side-by-side        │
│  • Escapes HTML special characters for security                      │
│  • Creates responsive, branded email template with:                  │
│    - Professional header with branding                               │
│    - Comparison table (Original | Enhanced)                          │
│    - Pro tips section                                                │
│    - Results summary                                                 │
│  • Sends via Resend API to user's email                              │
│  • Subject: "Your Title Enhancements are Ready! 🚀"                  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      6. SUCCESS RESPONSE                             │
│  Status: 200 OK                                                      │
│  Response: {                                                         │
│    "message": "Your new titles have been slided directly into        │
│                your inbox!"                                          │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Detailed Component Breakdown

### 1. **Server Entry Point** (`src/index.js`)

- Initializes Express application on port 3000
- Configures JSON and URL-encoded request body parsing
- Mounts YouTube router at `/api/youtube`
- Provides health check endpoint at `/`

### 2. **YouTube Controller** (`src/controllers/yt.controller.js`)

#### `getYoutubeId(req, res)`

**Purpose**: Main orchestrator that handles the entire workflow

- **Input**: `{ name: string, email: string }`
- **Process**:
  1. Validates required fields
  2. Searches YouTube for channel by name
  3. Fetches latest 5 videos from channel
  4. Sends titles to AI for enhancement
  5. Emails comparison report to user
- **Output**: Success message or error response

#### `latestVideos(channelId)`

**Purpose**: Retrieves recent video data from YouTube

- **Input**: YouTube channel ID
- **API Call**: `youtube/v3/search` with `order=date&maxResults=5`
- **Output**: `{ answer: enhancedTitles[], value: originalTitles[] }`

### 3. **AI Enhancement Controller** (`src/controllers/gemini.controller.js`)

#### `titleEnhance(title)`

**Purpose**: Uses Google Gemini AI to generate better titles

- **Model**: `gemini-2.5-flash`
- **Prompt Strategy**: Instructs AI to add '@' delimiter after each title
- **Parsing Logic**:
  1. Normalizes HTML entities (`&amp;` → `&`)
  2. Splits response on '@' character
  3. Trims whitespace from each title
  4. Filters out empty entries
  5. Fallback: returns raw text if no '@' found
- **Output**: Array of enhanced title strings

### 4. **Email Service Controller** (`src/controllers/resend.controller.js`)

#### `sendTitles(oldTitles, newTitles, email)`

**Purpose**: Generates and sends professional comparison email

- **Security**: Implements `escapeHtml()` to prevent XSS attacks
- **Email Components**:
  - **Header**: Branded title with icon
  - **Comparison Table**:
    - Left column: Original titles (gray background)
    - Right column: Enhanced titles (green background, bold)
  - **Info Boxes**:
    - 💡 Pro Tip: Educational content about title optimization
    - 📊 Results: Count of optimized titles
  - **Footer**: Branding and disclaimer
- **Styling**: Inline CSS for maximum email client compatibility
- **Sender**: `better-title <no-reply@pawpick.store>`
- **Output**: Success/error object with message details

### 5. **Routes** (`src/routes/youtube.route.js`)

- `POST /api/youtube/channel-id` → Triggers entire enhancement workflow

---

## 🔐 Environment Variables Required

```bash
# YouTube Data API Key
YOUTUBE_API_KEY=your_youtube_api_key_here

# Resend Email Service API Key
RESEND_API=your_resend_api_key_here

# Google Gemini AI (configured via SDK defaults)
# API key typically set via GOOGLE_API_KEY or SDK configuration
```

---

## 📊 API Endpoint Documentation

### POST `/api/youtube/channel-id`

Enhance YouTube channel video titles and email results

**Request Body:**

```json
{
  "name": "TechChannel",
  "email": "user@example.com"
}
```

**Success Response (200):**

```json
{
  "message": "Your new titles have been slided directly into your inbox!"
}
```

**Error Responses:**

- `400 Bad Request`: Missing name or email
- `500 Internal Server Error`: API failures or processing errors

---

## 🎨 Email Template Features

### Visual Design

- **Responsive Layout**: Max-width 800px, centered
- **Color Scheme**:
  - Primary: #3498db (Blue)
  - Success: #e8f5e9 (Light Green)
  - Warning: #fff3cd (Light Yellow)
  - Info: #e3f2fd (Light Blue)
- **Typography**: Arial, sans-serif for universal compatibility
- **Card Design**: White background with subtle shadow

### Content Structure

1. **Hero Section**: Welcome message with emoji
2. **Introduction**: Brief explanation of service
3. **Comparison Table**: Side-by-side title comparison
4. **Educational Callout**: SEO and engagement tips
5. **Results Summary**: Count of enhanced titles
6. **Professional Footer**: Branding and auto-generation notice

---

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Uses nodemon for auto-restart on file changes

### Production Mode

```bash
npm start
```

### Testing the Endpoint

```bash
curl -X POST http://localhost:3000/api/youtube/channel-id \
  -H "Content-Type: application/json" \
  -d '{
    "name": "YourChannelName",
    "email": "your@email.com"
  }'
```

---

## 🔄 Data Flow Summary

```
User Request
    ↓
YouTube Search (by channel name)
    ↓
Get Channel ID
    ↓
Fetch Latest 5 Videos
    ↓
Extract Original Titles
    ↓
Send to Gemini AI
    ↓
Parse Enhanced Titles (split by '@')
    ↓
Build HTML Email with Comparison Table
    ↓
Send via Resend API
    ↓
Return Success Message
```

---

## 🛡️ Security Features

1. **Input Validation**: Required field checks for name and email
2. **HTML Escaping**: All user-generated content escaped before email insertion
3. **Environment Variables**: Sensitive API keys stored in .env
4. **Error Handling**: Try-catch blocks prevent server crashes
5. **XSS Prevention**: `escapeHtml()` function sanitizes all dynamic content

---

## 🎯 Key Business Logic

### Title Enhancement Strategy

The Gemini AI is prompted to create titles that:

- Are more engaging and clickable
- Include relevant keywords for SEO
- Follow YouTube best practices
- Maintain the original video's theme/context
- Are concise yet descriptive

### Email Delivery Strategy

- **Immediate delivery**: Email sent synchronously during API request
- **Professional presentation**: Branded, responsive HTML template
- **Clear comparison**: Side-by-side view of old vs new titles
- **Actionable insights**: Educational tips included

---

## 📦 Dependencies

```json
{
  "@google/genai": "^1.27.0", // Google Gemini AI SDK
  "axios": "^1.12.2", // HTTP client for API calls
  "cors": "^2.8.5", // CORS middleware
  "dotenv": "^17.2.3", // Environment variable management
  "express": "^5.1.0", // Web framework
  "nodemon": "^3.1.10", // Development auto-restart
  "resend": "^6.0.0" // Email service SDK
}
```

---

## 🎉 Success Metrics

Each successful request:

1. ✅ Searches and finds YouTube channel
2. ✅ Retrieves 5 latest video titles
3. ✅ Enhances titles using AI
4. ✅ Sends professional email report
5. ✅ Returns confirmation to client

---

## 🔮 Future Enhancements (Planned Structure)

- **Database** (`src/db/`): Store enhancement history
- **Middlewares** (`src/middlewares/`): Authentication, rate limiting
- **Utils** (`src/utils/`): Shared helper functions
- **Analytics**: Track enhancement success rates
- **Batch Processing**: Handle multiple channels
- **Webhook Integration**: Auto-enhance new videos

---

## 📄 License & Contact

**Project**: Better Title  
**Version**: 1.0.0  
**Type**: Express.js REST API  
**Email Service**: no-reply@pawpick.store

---

_This backend service was built to help content creators optimize their YouTube video titles using AI, delivering professional insights directly to their inbox._ 🚀
