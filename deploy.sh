#!/bin/bash
# Cloudways 서버에서 실행하는 배포 스크립트
# 사용법: ssh로 접속 후 ./deploy.sh 실행

set -e

APP_DIR="/home/master/applications/stylemate/public_html"

echo "📦 StyleMate 배포 시작..."

cd "$APP_DIR"

echo "1/5 코드 업데이트..."
git pull origin main

echo "2/5 의존성 설치..."
npm install --production=false

echo "3/5 Prisma 클라이언트 생성..."
npx prisma generate

echo "4/5 DB 마이그레이션..."
npx prisma db push

echo "5/5 빌드 및 재시작..."
npm run build
pm2 restart stylemate || pm2 start ecosystem.config.js

echo "✅ 배포 완료!"
pm2 status
