#!/bin/bash

echo "🚀 Starting deployment process..."

# Check if we're in production (Vercel sets NODE_ENV=production)
if [ "$NODE_ENV" = "production" ]; then
    echo "📦 Production deployment detected"
    
    # Use PostgreSQL schema for production
    echo "🗄️ Using PostgreSQL schema..."
    cp prisma/schema.postgres.prisma prisma/schema.prisma
    
    # Generate Prisma client
    echo "🔧 Generating Prisma client..."
    npx prisma generate
    
    # Push schema to database (creates tables)
    echo "📊 Pushing schema to PostgreSQL..."
    npx prisma db push
    
    echo "✅ Production setup complete!"
else
    echo "🛠️ Development environment detected"
    echo "✅ Using SQLite for development"
fi

echo "🎉 Deployment script completed!"
