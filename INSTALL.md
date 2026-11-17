# БГУ — фирменные анимации, интеграция на главную

Пакет основан на новом `ModernHome.tsx` из предыдущего обновления. Он **не изменяет** `Header`, `Footer`, роуты, словари, backend и `/admin`.

## Что добавлено
- Вступительная заставка БГУ ~1,15 c: лёгкий SVG-орнамент, вращение и появление названия (условная графика, не официальный герб).
- Hero-карусель из трёх слайдов с локализованными текстами RU / KY / EN / zh-CN, переходами, кнопками и прогресс-линией. Автопереключение каждые 6,5 c, при скрытой вкладке пауза.
- Горизонтальная карусель карточек факультетов с управлением кнопками и свайпом.
- Уже существующие эффекты при прокрутке и наведении сохранены.
- При `prefers-reduced-motion: reduce` заставка/автокарусель/движение отключаются.
- Нет новых зависимостей и сторонних API.

## Установка на рабочем ПК

Сначала откройте PowerShell из папки проекта и проверьте статус:

```powershell
$env:Path += ";D:\Programs\Git\cmd;C:\Program Files\nodejs"
cd "C:\Users\Байэл Рыскельдиев\Projects\bsu-frontend"
git status
git branch --show-current
```

Если уже распакован пакет `bsu-modern-homepage.zip`, сохраняйте состояние, не делайте `git reset`.
Перед заменой файлов создайте локальные копии (при необходимости):

```powershell
Copy-Item src\components\home\ModernHome.tsx src\components\home\ModernHome.tsx.before-motion -ErrorAction SilentlyContinue
Copy-Item src\app\modern-home.css src\app\modern-home.css.before-motion -ErrorAction SilentlyContinue
```

Архив `bsu-signature-motion-integration.zip` распаковать в **корень проекта**, согласившись на замену:

```powershell
Expand-Archive "$HOME\Downloads\bsu-signature-motion-integration.zip" -DestinationPath . -Force
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

Если `main` содержит незафиксированные изменения, **не переключайте ветку до сохранения этих изменений**. После проверки создайте рабочую ветку с помощью `git switch -c feature/bsu-signature-motion` (если имя ещё не существует), затем `git add`, `git commit` и `git push`.

## Проверка

Посетите `http://localhost:3000`, проверьте стрелки, автосмену слайдов, свайп факультетов, четыре языка, кликабельность старых разделов и адаптивность. Для публикации создайте PR в `main` и дождитесь CI. `/admin` остаётся демонстрационным и не должен быть публичным без защиты.
