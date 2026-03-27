---
name: "wewe-rss-installer"
description: "Install WeWe RSS - a WeChat public account subscription and search tool. Invoke when user wants to set up WeChat RSS subscription system or needs WeChat public account content management."
---

# WeWe RSS Installer

This skill helps you install and configure WeWe RSS, a WeChat public account subscription and search tool with a brutalist design style.

## Features

- Subscribe to WeChat public accounts
- Search articles from subscribed accounts
- RSS feed generation
- Account management
- Brutalist UI design style
- No authentication required (AUTH_CODE disabled)

## Installation

### Prerequisites

- Node.js 18+
- pnpm package manager
- SQLite (included)

### Steps

1. Clone the repository:
```bash
git clone https://github.com/cooderl/wewe-rss.git
cd wewe-rss
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment:
```bash
# Create .env file in apps/server/
cat > apps/server/.env << 'EOF'
HOST=0.0.0.0
PORT=4000

# SQLite database
DATABASE_URL="file:../data/wewe-rss.db"
DATABASE_TYPE="sqlite"

# Auth code disabled
# AUTH_CODE=123567

# Other settings
MAX_REQUEST_PER_MINUTE=60
FEED_MODE="fulltext"
SERVER_ORIGIN_URL=http://localhost:4000
CRON_EXPRESSION="35 5,17 * * *"
ENABLE_CLEAN_HTML=false
UPDATE_DELAY_TIME=60
PLATFORM_URL="https://weread.111965.xyz"
EOF
```

4. Initialize database:
```bash
cd apps/server
npx prisma migrate dev
cd ../..
```

5. Start development servers:
```bash
pnpm run dev
```

6. Access the application:
   - Frontend: http://localhost:5174/dash
   - Backend API: http://localhost:4000

## Usage

1. Navigate to "账号管理" (Account Management)
2. Click "添加微信账号" (Add WeChat Account)
3. Scan the QR code with WeChat
4. After adding account, go to "公众号源" (Public Account Sources)
5. Add public account by pasting article share links
6. View articles and generate RSS feeds

## Configuration

### Disable AUTH_CODE

The AUTH_CODE verification is disabled by default. Users can access the application without authentication.

### Custom Port

To change the backend port, modify `PORT` in `apps/server/.env` and `VITE_SERVER_ORIGIN_URL` in `apps/web/.env.local`.

### Database

SQLite is used by default. To use MySQL instead:

```env
DATABASE_URL="mysql://root:password@127.0.0.1:3306/wewe-rss"
```

## Troubleshooting

### Database Error

If you see "Unable to open database file":
```bash
mkdir -p data
cd apps/server
npx prisma migrate dev
```

### Port Already in Use

Check what's using the port:
```bash
lsof -ti:4000
```

Kill the process or change the port in configuration.

## Support

- GitHub: https://github.com/cooderl/wewe-rss
- Issues: https://github.com/cooderl/wewe-rss/issues
