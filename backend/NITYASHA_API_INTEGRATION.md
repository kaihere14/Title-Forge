# Nityasha API Integration Guide

## Overview

The Nityasha API allows you to generate AI-optimized YouTube video titles for any channel. Simply provide a channel name, and the API will fetch the latest 5 videos and return both the original titles and AI-enhanced versions optimized for views and engagement.

---

## API Endpoint

### Base URL

```
https://titleforge.me/
```

### Endpoint

```
POST /api/nityasha/generate
```

---

## Authentication

The API uses API Key authentication via headers.

### Header Required

```
x-api-key: YOUR_API_KEY_HERE
```

**Note:** You must obtain your API key from the TitleForge admin. This key should be kept secure and never exposed in client-side code.

---

## Request

### Method

`POST`

### Headers

| Header         | Value              | Required | Description                            |
| -------------- | ------------------ | -------- | -------------------------------------- |
| `x-api-key`    | `string`           | ✅ Yes   | Your unique API key for authentication |
| `Content-Type` | `application/json` | ✅ Yes   | Must be `application/json`             |

### Request Body

```json
{
  "name": "channel_name_here"
}
```

#### Parameters

| Parameter | Type     | Required | Description                                                   |
| --------- | -------- | -------- | ------------------------------------------------------------- |
| `name`    | `string` | ✅ Yes   | The YouTube channel name (e.g., "beast boy shubh", "MrBeast") |

### Example Request

#### cURL

```bash
curl -X POST https://titleforge.me/api/nityasha/generate \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY_HERE" \
  -d '{
    "name": "beast boy shubh"
  }'
```

#### JavaScript (fetch)

```javascript
const response = await fetch(
  "https://titleforge.me/api/nityasha/generate",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "YOUR_API_KEY_HERE",
    },
    body: JSON.stringify({
      name: "beast boy shubh",
    }),
  }
);

const data = await response.json();
console.log(data);
```

#### Python (requests)

```python
import requests

url = 'https://your-backend-domain.com/api/nityasha/generate'
headers = {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY_HERE'
}
payload = {
    'name': 'beast boy shubh'
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()
print(data)
```

---

## Response

### Success Response (200 OK)

#### Response Body

```json
{
  "oldTitles": [
    "THE ONLY REAL TRUTH ABOUT THE UNIVERSE | Outer Wilds - Part 4 (ENDING)",
    "DO NOT LOOK AWAY FROM THE MOON | Outer Wilds - Part 3",
    "BBS GIVES A LOVE ADVICE ❤️🥰",
    "THE SPACE IS VERY SCARY | Outer Wilds - Part 2",
    "THE MOST CRAZY GAME I'VE EVER PLAYED | Megabonk"
  ],
  "newTitles": [
    "This New BURST of Truth About the Universe! Outer Wilds Finale!",
    "Don't Look Down! A NEW Twist on the Moon! Outer Wilds Part 3",
    "BBS Gives NEW Love Advice to BOOST Your Life!",
    "This NEW Fear of Space will Chill You Down! Outer Wilds P.2",
    "My Mind Will BURST Playing This NEW Crazy Game! Megabonk!"
  ],
  "channelName": "beast boy shubh",
  "channelId": "UCI86prlqXhbkREDMTaORvLQ"
}
```

#### Response Fields

| Field         | Type            | Description                                                         |
| ------------- | --------------- | ------------------------------------------------------------------- |
| `oldTitles`   | `array<string>` | Array of 5 original video titles from the channel's latest uploads  |
| `newTitles`   | `array<string>` | Array of 5 AI-optimized titles corresponding to each original title |
| `channelName` | `string`        | The channel name that was searched                                  |
| `channelId`   | `string`        | The unique YouTube channel ID                                       |

---

## Error Responses

### 400 Bad Request

**Cause:** Missing or invalid `name` parameter

```json
{
  "error": "Name is required"
}
```

### 403 Forbidden

**Cause:** Invalid or missing API key in headers

```json
{
  "error": "Forbidden: Invalid or missing API key."
}
```

### 500 Internal Server Error

**Cause:** Server error (YouTube API issues, network problems, etc.)

```json
{
  "error": "Internal Server Error"
}
```

---

## How It Works

1. **Channel Lookup**: The API searches YouTube for the provided channel name and retrieves the channel ID
2. **Fetch Videos**: Retrieves the latest 5 videos from the channel's uploads playlist
3. **AI Analysis**:
   - First time: Analyzes the channel's content style and caches the analysis
   - Subsequent requests: Uses cached analysis for faster response
4. **Title Generation**: Generates optimized titles using AI based on:
   - SEO best practices
   - Click-through rate optimization
   - Channel's existing style and tone
   - Engagement patterns
5. **Return Results**: Returns both original and enhanced titles for comparison

---

## Rate Limits & Performance

- **Caching**: Channel analysis is cached in Redis for 24 hours, resulting in faster responses for repeated requests
- **Rate Limiting**: Please implement client-side rate limiting to avoid overwhelming the API
- **Response Time**:
  - First request: ~5-10 seconds (includes channel analysis)
  - Cached requests: ~2-3 seconds

---

## Best Practices

1. **Store Your API Key Securely**

   - Never expose your API key in client-side code
   - Use environment variables or secure key management systems
   - Rotate your API key periodically

2. **Error Handling**

   - Always implement proper error handling for all possible HTTP status codes
   - Retry failed requests with exponential backoff
   - Log errors for debugging

3. **Input Validation**

   - Validate channel names before sending requests
   - Trim whitespace from channel names
   - Handle special characters appropriately

4. **Caching Results**
   - Consider caching successful responses on your end
   - Reduce redundant API calls for the same channel

---

## Support & Contact

For API access, issues, or questions:

- **Email**: support@titleforge.com
- **Documentation**: https://titleforge.com/docs
- **Status Page**: https://status.titleforge.com

---

## Changelog

### Version 1.0 (Current)

- Initial release
- Channel name-based title generation
- Redis caching for improved performance
- Support for 5 latest videos per request

---

## Example Use Cases

### 1. Bulk Title Optimization

Generate optimized titles for multiple channels in your network:

```javascript
const channels = ["channel1", "channel2", "channel3"];

for (const channel of channels) {
  const response = await fetch(
    "https://api.titleforge.com/api/nityasha/generate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY,
      },
      body: JSON.stringify({ name: channel }),
    }
  );

  const data = await response.json();
  console.log(`Optimized titles for ${channel}:`, data.newTitles);
}
```

### 2. Title Comparison Dashboard

Create a dashboard showing before/after title comparisons:

```javascript
const data = await getTitles("beast boy shubh");

data.oldTitles.forEach((oldTitle, index) => {
  console.log("Original:", oldTitle);
  console.log("Optimized:", data.newTitles[index]);
  console.log("---");
});
```

### 3. Automated Weekly Reports

Schedule weekly title optimization reports for content creators:

```python
import schedule
import time

def generate_report():
    channels = ['channel1', 'channel2']
    for channel in channels:
        data = get_optimized_titles(channel)
        send_email_report(channel, data)

schedule.every().monday.at("09:00").do(generate_report)

while True:
    schedule.run_pending()
    time.sleep(1)
```

---

## FAQ

**Q: How many videos can I analyze per request?**  
A: Currently, the API returns titles for the 5 most recent videos from a channel.

**Q: How often is the channel analysis updated?**  
A: Channel analysis is cached for 24 hours and automatically refreshed after expiry.

**Q: Can I request titles for a specific video?**  
A: Not in this version. The API automatically fetches the latest 5 videos from the channel.

**Q: What languages are supported?**  
A: The API works with any language, though optimization is best for English content.

**Q: Is there a limit on API calls?**  
A: Rate limits depend on your subscription plan. Contact support for details.

---

**Last Updated:** October 31, 2025  
**API Version:** 1.0  
**Documentation Version:** 1.0
