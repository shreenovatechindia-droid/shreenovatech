#!/bin/bash
# ============================================================
# ShreeNova Tech — Production Build Script
# Usage: bash build.sh
# ============================================================

echo "🚀 Building ShreeNova Tech for production..."

# 1. Build main frontend
echo "📦 Building main frontend..."
cd "$(dirname "$0")"
npm run build
echo "✅ Main frontend built → dist/"

# 2. Build admin panel
echo "📦 Building admin panel..."
cd admin-panel
npm run build
echo "✅ Admin panel built → backend/admin-react/"

echo ""
echo "✅ Build complete!"
echo ""
echo "📁 Deploy structure:"
echo "   dist/           → https://shreenovatech.in"
echo "   backend/        → https://shreenovatech.in/api"
echo "   backend/admin-react/ → https://shreenovatech.in/admin"
