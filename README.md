# Valentinstag Website für Layal

Eine kitschig-süße Valentinstag-Website, die Layal fragt, ob sie am 14.02.2026 dein Date sein möchte.

## Features

- Landing Page mit "Ja"/"Nein"-Buttons (der Nein-Button läuft weg!)
- Glückliches Folge-Screen nach "Ja" mit Foto-Platzhalter
- Herzchen-Fang-Minispiel mit Highscore (localStorage)
- Sparkle-Partikel und schwebende Herzen im Hintergrund
- Responsive Design (Mobile/Tablet/Desktop)

## Foto austauschen

Ersetze die Datei `public/assets/placeholder.svg` durch dein eigenes Foto.
Du kannst jedes Bildformat verwenden (`.jpg`, `.png`, `.webp`) – passe dann den `src`-Pfad in `public/index.html` an:

```html
<img id="couple-photo" src="assets/dein-foto.jpg" alt="Unser Foto">
```

## Build & Run (Docker)

```bash
# Image bauen
docker build -t valentines .

# Container starten
docker run -p 8080:80 valentines
```

Oder mit Docker Compose:

```bash
docker compose up --build
```

Dann öffne: **http://localhost:8080**

## Projektstruktur

```
valentinstag/
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── README.md
└── public/
    ├── index.html
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── app.js      # Landing Page, Nein-Button, Sparkles
    │   └── game.js     # Herzchen-Fang-Minispiel
    └── assets/
        └── placeholder.svg
```

## Technik

- Rein statisch: HTML + CSS + Vanilla JavaScript
- Keine externen Abhängigkeiten oder Libraries
- nginx:alpine als Docker-Image
- Highscore via localStorage im Browser
