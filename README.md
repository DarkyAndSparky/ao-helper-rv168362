# ao-helper-rv168362

Набор вспомогательных файлов для клиента Allods Online 1.1 (ревизия 168362).

## Что внутри

- `LocKit/` — ресурсы и проекты лаунчера и SyncVersion (локализации ENG, ESP, FRA, GER, RUS)
- `ObfuscationTools/` — инструменты обфускации
- `PatchTools/` — утилиты для создания патчей
- `PDB/` — отладочные символы
- `ProfilesDebug/` — конфигурационные файлы профилей
- `Release_bin/` — собранные бинарные файлы
- `Server/` — серверные файлы
- `Unprotected/` — незащищённые сборки (GM_bin, Gamers_bin)
- `TextRus.pak` — русский текстовый пакет
- `168362.rev` — файл ревизии

## Крупные файлы (распаковка)

Из-за лимита GitHub в 100 МБ три больших файла лежат в репозитории в виде архивов 7z:

| Архив | Распаковать в |
|-------|---------------|
| `LocKit/Launcher.lib.7z.001` | `LocKit/Launcher.lib` |
| `LocKit/SyncVersion.lib.7z.001` | `LocKit/SyncVersion.lib` |
| `Server/Tests.pak.7z.001` | `Server/Tests.pak` |

Откройте файл `.001` в [7-Zip](https://www.7-zip.org/) и распакуйте его в ту же папку.
Оригиналы добавлены в `.gitignore`, чтобы не попасть в коммиты.
