# treymack.github.io

Personal blog hosted at http://treymack.github.io

## Local Development

This site is built with Jekyll. You can run it locally using Docker (recommended) or a local Ruby installation.

### Using Docker (Recommended)

No need to install Ruby, Bundler, or Jekyll on your local machine.

**Start the server:**
```bash
docker compose up
```

**Stop the server:**
Press `Ctrl+C` or run:
```bash
docker compose down
```

**View the site:**
Open your browser to http://localhost:4000

The server includes live reload - changes to files will automatically rebuild the site and refresh your browser.

### Using Local Ruby Installation

If you prefer to run Jekyll directly:

1. Install dependencies:
   ```bash
   bundle install
   ```

2. Start the server:
   ```bash
   bundle exec jekyll serve --livereload
   ```

3. View at http://localhost:4000

## Publishing

Changes pushed to the `master` branch are automatically published to GitHub Pages.
