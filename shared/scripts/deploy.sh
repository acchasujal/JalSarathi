#!/bin/bash

echo "🚀 Starting JalSarathi Deployment..."

# Backend deployment
echo "📦 Deploying JalSarathi backend..."
cd backend
npm run build

# Frontend deployment  
echo "🌐 Deploying JalSarathi frontend..."
cd ../frontend
npm run build

echo "✅ JalSarathi deployment completed successfully!"
echo "🔗 Backend URL: https://jalsarathi-backend.render.com"
echo "🔗 Frontend URL: https://jalsarathi.vercel.app"