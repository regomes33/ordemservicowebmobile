#!/bin/bash

# 🚀 Script de Deploy Automatizado para Play Store
# Este script simplifica o processo de build para a Google Play Store

echo "🚀 Iniciando processo de build para Play Store..."
echo ""

# Verificar se EAS CLI está instalado
if ! command -v eas &> /dev/null
then
    echo "❌ EAS CLI não encontrado!"
    echo "📦 Instalando EAS CLI..."
    npm install -g eas-cli
    echo "✅ EAS CLI instalado com sucesso!"
    echo ""
fi

# Verificar se está logado no Expo
echo "🔐 Verificando login no Expo..."
if ! eas whoami &> /dev/null
then
    echo "❌ Você não está logado no Expo!"
    echo "Por favor, faça login:"
    eas login
else
    echo "✅ Você já está logado no Expo!"
fi

echo ""
echo "📋 Escolha o tipo de build:"
echo "1) Preview (APK para teste rápido)"
echo "2) Production (AAB para Play Store)"
read -p "Digite sua escolha (1 ou 2): " choice

case $choice in
    1)
        echo ""
        echo "🔨 Gerando build de PREVIEW (APK)..."
        eas build --platform android --profile preview
        echo ""
        echo "✅ Build de preview concluído!"
        echo "📱 Você pode instalar o APK diretamente no seu celular para testar."
        ;;
    2)
        echo ""
        echo "🔨 Gerando build de PRODUÇÃO (AAB)..."
        eas build --platform android --profile production
        echo ""
        echo "✅ Build de produção concluído!"
        echo "📦 Baixe o arquivo .aab e faça upload no Google Play Console."
        echo ""
        echo "📝 Próximos passos:"
        echo "1. Acesse https://play.google.com/console"
        echo "2. Crie um novo app (se ainda não criou)"
        echo "3. Vá em 'Produção' ou 'Teste Interno'"
        echo "4. Faça upload do arquivo .aab"
        ;;
    *)
        echo "❌ Opção inválida!"
        exit 1
        ;;
esac

echo ""
echo "🎉 Processo concluído!"
