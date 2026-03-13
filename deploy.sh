#!/bin/bash

# Скрипт автоматического обновления игры на GitHub Pages
# Использование: ./deploy.sh "сообщение коммита"

set -e  # Остановить выполнение при ошибке

echo "🚀 Начинаем обновление игры..."
echo ""

# Проверка наличия изменений
if [[ -n $(git status -s) ]]; then
  echo "📝 Найдены изменения, создаём коммит..."
  
  # Добавляем все изменения
  git add .
  
  # Создаём коммит с сообщением
  if [ -z "$1" ]; then
    COMMIT_MSG="Обновление игры $(date '+%Y-%m-%d %H:%M:%S')"
  else
    COMMIT_MSG="$1"
  fi
  
  git commit -m "$COMMIT_MSG"
  echo "✅ Коммит создан: $COMMIT_MSG"
  echo ""
  
  # Пушим на GitHub
  echo "📤 Отправляем изменения на GitHub..."
  git push origin main
  echo "✅ Изменения отправлены на GitHub"
  echo ""
else
  echo "ℹ️  Нет изменений для коммита"
  echo ""
fi

# Собираем проект
echo "🔨 Собираем проект для продакшена..."
npm run build
echo "✅ Проект собран"
echo ""

# Публикуем на GitHub Pages
echo "🌐 Публикуем на GitHub Pages..."
npx gh-pages -d dist
echo "✅ Игра опубликована!"
echo ""

echo "🎉 Готово! Игра доступна по адресу:"
echo "   https://brandgrossmeister8-cmd.github.io/race-to-insight/"
echo ""
echo "⏱️  Подождите 1-2 минуты, чтобы изменения применились"
