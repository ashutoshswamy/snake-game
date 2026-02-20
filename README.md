# Classic Snake

A lightweight, browser-based Snake game built with vanilla HTML, CSS, and JavaScript.

## Features

- 20x20 grid-based Snake gameplay
- Keyboard controls (`Arrow Keys` or `WASD`)
- On-screen D-pad controls for smaller screens
- Pause/resume with `Space`
- Restart with `Restart` button or `Enter` after game over
- Live score and game status display
- Auto-pause when the browser tab loses focus
- Responsive UI with no build tools or dependencies

## Tech Stack

- `index.html`
- `styles.css`
- `app.js` (ES module)

## How to Run

No installation is required.

1. Clone or download this project.
2. Open `index.html` in your browser.

Optional (recommended): serve locally for module-safe behavior across environments.

```bash
# from the project directory
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Controls

- Move: `Arrow Keys` or `W`, `A`, `S`, `D`
- Pause/Resume: `Space`
- Start: `Start` button
- Restart: `Restart` button
- Restart after game over: `Enter`

## Gameplay Rules

- Eat food to grow and increase score.
- Hitting a wall ends the game.
- Hitting your own body ends the game.
- Reverse-direction moves are blocked to prevent instant self-collision.

## Project Structure

- `index.html` - game layout and UI elements
- `styles.css` - styling, responsive layout, and visual theme
- `app.js` - game state, movement logic, rendering, and input handling

## Credits

Developer: Ashutosh Swamy

- GitHub: [ashutoshswamy](https://github.com/ashutoshswamy)
- LinkedIn: [ashutoshswamy](https://www.linkedin.com/in/ashutoshswamy)
- Portfolio: [ashutoshswamy.in](https://ashutoshswamy.in)
