# Website Setup Guide for Theme Pushing

This guide shows you how to set up your website to receive theme updates from the Dynamic Theme Generator & Pusher.

## 🚀 Quick Start

### 1. Create Your Website
Build and deploy your website using any platform:
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **GitHub Pages**: Push to main branch
- **Custom hosting**: Deploy to your server

### 2. Add Webhook Endpoint
Create an API route in your website to receive theme updates:

#### For Next.js (App Router):
```typescript
// app/api/theme-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const themeData = await request.json();
    
    // Extract theme information
    const { theme, themeId, themeName } = themeData;
    
    // Update your website's CSS variables
    const cssVariables = `
      :root {
        --color-primary: ${theme.colors.primary};
        --color-secondary: ${theme.colors.secondary};
        --color-accent: ${theme.colors.accent};
        --color-neutral: ${theme.colors.neutral};
        --color-info: ${theme.colors.info};
        --color-success: ${theme.colors.success};
        --color-warning: ${theme.colors.warning};
        --color-error: ${theme.colors.error};
        --radius-box: ${theme.radius.box}px;
        --radius-field: ${theme.radius.field}px;
        --radius-selector: ${theme.radius.selector}px;
      }
    `;
    
    // Save to your database or file system
    // For example, save to a JSON file or database
    await saveThemeToDatabase(themeData);
    
    // Trigger a rebuild/redeploy if needed
    // await triggerRebuild();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Theme updated successfully' 
    });
  } catch (error) {
    console.error('Theme webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to update theme' }, 
      { status: 500 }
    );
  }
}
```

#### For Next.js (Pages Router):
```typescript
// pages/api/theme-webhook.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const themeData = req.body;
    
    // Process theme data
    const { theme, themeId, themeName } = themeData;
    
    // Update your website's styling
    await updateWebsiteTheme(themeData);
    
    res.status(200).json({ 
      success: true, 
      message: 'Theme updated successfully' 
    });
  } catch (error) {
    console.error('Theme webhook error:', error);
    res.status(500).json({ error: 'Failed to update theme' });
  }
}
```

#### For Express.js:
```javascript
// server.js
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/theme-webhook', async (req, res) => {
  try {
    const themeData = req.body;
    
    // Process theme data
    const { theme, themeId, themeName } = themeData;
    
    // Update your website's styling
    await updateWebsiteTheme(themeData);
    
    res.json({ 
      success: true, 
      message: 'Theme updated successfully' 
    });
  } catch (error) {
    console.error('Theme webhook error:', error);
    res.status(500).json({ error: 'Failed to update theme' });
  }
});
```

### 3. Use CSS Variables in Your Website
Make sure your website uses CSS variables for styling:

```css
/* globals.css */
:root {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --color-accent: #f59e0b;
  --color-neutral: #6b7280;
  --color-info: #06b6d4;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --radius-box: 8px;
  --radius-field: 6px;
  --radius-selector: 4px;
}

/* Use variables in your components */
.button {
  background-color: var(--color-primary);
  border-radius: var(--radius-field);
}

.card {
  border-radius: var(--radius-box);
  border: 1px solid var(--color-neutral);
}
```

### 4. Register Your Website
1. Go to the Dynamic Theme Generator & Pusher
2. Click "Add Demo Website" or register your website
3. Enter your website's webhook URL: `https://your-website.com/api/theme-webhook`
4. Your website is now connected!

## 🔧 Advanced Setup

### Database Storage
Store theme data in your database for persistence:

```typescript
// Save theme to database
async function saveThemeToDatabase(themeData: any) {
  const { theme, themeId, themeName } = themeData;
  
  // Save to your database (example with Prisma)
  await prisma.websiteTheme.upsert({
    where: { themeId },
    update: { 
      themeData: JSON.stringify(theme),
      updatedAt: new Date()
    },
    create: {
      themeId,
      themeName,
      themeData: JSON.stringify(theme),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
}
```

### Automatic Rebuilds
Trigger automatic rebuilds when themes are updated:

```typescript
// Trigger Vercel rebuild
async function triggerVercelRebuild() {
  const response = await fetch('https://api.vercel.com/v1/integrations/deploy', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'your-project-name',
      url: 'https://your-website.vercel.app'
    })
  });
  
  return response.ok;
}
```

### Security
Add webhook signature verification:

```typescript
// Verify webhook signature
function verifyWebhookSignature(payload: string, signature: string, secret: string) {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

## 🎨 Testing Your Setup

1. **Use webhook.site**: Get a test webhook URL to verify the system works
2. **Create a demo theme**: Use the theme generator to create a test theme
3. **Push the theme**: Send it to your website
4. **Check the results**: Verify your website's styling has updated

## 📝 Example Webhook Payload

Your website will receive data in this format:

```json
{
  "theme": {
    "colors": {
      "primary": "#3b82f6",
      "secondary": "#64748b",
      "accent": "#f59e0b",
      "neutral": "#6b7280",
      "info": "#06b6d4",
      "success": "#10b981",
      "warning": "#f59e0b",
      "error": "#ef4444"
    },
    "radius": {
      "box": 8,
      "field": 6,
      "selector": 4
    },
    "effects": {
      "depth": true,
      "noise": false
    }
  },
  "themeId": "theme_123",
  "themeName": "My Custom Theme",
  "timestamp": "2024-01-15T10:30:00Z",
  "signature": "hmac_signature_for_security"
}
```

## 🚀 Deployment Platforms

### Vercel
- Deploy with: `vercel`
- Webhook URL: `https://your-site.vercel.app/api/theme-webhook`
- Auto-rebuild: Use Vercel API to trigger rebuilds

### Netlify
- Deploy with: `netlify deploy`
- Webhook URL: `https://your-site.netlify.app/.netlify/functions/theme-webhook`
- Auto-rebuild: Use Netlify API to trigger rebuilds

### GitHub Pages
- Deploy with: Push to main branch
- Webhook URL: `https://your-username.github.io/your-repo/api/theme-webhook`
- Note: Requires custom server for webhook support

Now your website is ready to receive dynamic theme updates! 🎉
