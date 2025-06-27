#!/bin/bash

# 商家管理后台部署脚本

echo "🚀 开始部署商家管理后台..."

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    pnpm install
fi

# 构建H5版本
echo "🏗️  构建H5版本..."
pnpm build:h5

if [ $? -eq 0 ]; then
    echo "✅ H5版本构建成功！"
    echo "📁 构建文件位置: dist/"
    echo "🌐 可以将dist目录部署到任何静态文件服务器"
else
    echo "❌ H5版本构建失败！"
    exit 1
fi

# 构建微信小程序版本
echo "🏗️  构建微信小程序版本..."
pnpm build:weapp

if [ $? -eq 0 ]; then
    echo "✅ 微信小程序版本构建成功！"
    echo "📁 构建文件位置: dist/"
    echo "📱 可以使用微信开发者工具打开dist目录进行预览和发布"
else
    echo "❌ 微信小程序版本构建失败！"
    exit 1
fi

echo ""
echo "🎉 部署完成！"
echo ""
echo "📖 使用说明："
echo "1. H5版本: 将dist目录部署到Web服务器"
echo "2. 微信小程序: 使用微信开发者工具打开dist目录"
echo "3. 开发模式: pnpm dev:h5 或 pnpm dev:weapp"
echo "" 