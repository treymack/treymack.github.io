# Architecture

These diagrams follow the [C4 model](https://c4model.com/) at its first two levels:

- **System Context**: the blog, the people who use it, and the external systems it depends on
- **Containers**: the deployable or runnable pieces inside the blog and how they talk to each other

The site is fully static. Astro renders everything to `dist/` at build time, so there is no server or database at runtime. The only code that runs live is the browser JavaScript, which calls out to Giscus and Google Analytics.

Each diagram is drawn in Mermaid, which GitHub renders. Each Mermaid diagram has an ASCII version below it for reading in a terminal or editor. Keep the two in sync.

## System Context

```mermaid
%%{init: {"flowchart": {"wrappingWidth": 320}}}%%
flowchart TB
  reader["<b>Reader</b><br/>[Person]<br/>Reads posts, follows RSS,<br/>leaves comments"]
  author["<b>Author (Trey Mack)</b><br/>[Person]<br/>Writes Markdown posts,<br/>opens PRs to master"]

  blog["<b>Trey Mack Blog</b><br/>[Software System]<br/>Static Astro site hosted on GitHub Pages:<br/>posts, About page, RSS feed, sitemap"]

  actions["<b>GitHub Actions</b><br/>[External System]<br/>ci.yml: build + unit + e2e on PRs<br/>deploy.yml: build + publish to<br/>GitHub Pages on push to master<br/>dependabot-auto-merge.yml: merges<br/>non-major Dependabot PRs after CI"]
  giscus["<b>Giscus</b><br/>[External System]<br/>Comment widget; threads<br/>keyed by page pathname"]
  ga["<b>Google Analytics</b><br/>[External System]<br/>Pageview tracking<br/>(treymack.com only)"]
  social["<b>LinkedIn / GitHub / Twitter</b><br/>[External Systems]<br/>Profiles (plain links)"]
  discussions["<b>GitHub Discussions</b><br/>[External System]<br/>treymack/treymack.github.io<br/>category: Announcements"]

  reader -->|"browses www.treymack.com,<br/>reads /feed.xml (HTTPS)"| blog
  author -->|"git push / PR"| actions
  actions -->|"deploys"| blog
  blog -->|"embeds comments"| giscus
  blog -->|"loads analytics"| ga
  blog -->|"links out to"| social
  giscus -->|"stores threads in"| discussions

  classDef person fill:#08427b,stroke:#052e56,color:#fff
  classDef system fill:#1168bd,stroke:#0b4884,color:#fff
  classDef external fill:#8a8a8a,stroke:#6b6b6b,color:#fff
  class reader,author person
  class blog system
  class actions,giscus,ga,social,discussions external
```

<details>
<summary>ASCII version</summary>

```text
    +----------------------------+                                    +------------------------------+
    | [Person]                   |                                    | [Person]                     |
    | Reader                     |                                    | Author (Trey Mack)           |
    | Reads posts, follows RSS,  |                                    | Writes Markdown posts,       |
    | leaves comments            |                                    | opens PRs to master          |
    +--------------+-------------+                                    +---------------+--------------+
                   | browses www.treymack.com,                                        |
                   | reads /feed.xml (HTTPS)                                          | git push / PR
                   |                                                                  |
                   v                                                                  v
  +================================================+            +------------------------------------+
  | [Software System]                              |            | [External System]                  |
  | Trey Mack Blog                                 |  deploys   | GitHub Actions + Dependabot        |
  | Static Astro site hosted on GitHub Pages:      |<-----------| ci.yml: build + unit + e2e on PRs  |
  | posts, About page, RSS feed, sitemap           |            | deploy.yml: build + publish to     |
  +==========+=============================+===+===+            | GitHub Pages on push to master     |
             |                             |   | links out to   +------------------------------------+
             | embeds comments             |   +----------------------+
             |                             | loads analytics          |
             v                             v                          v
+-------------------------+    +----------------------+   +------------------------+
| [External System]       |    | [External System]    |   | [External Systems]     |
| Giscus                  |    | Google Analytics     |   | LinkedIn / GitHub /    |
| Comment widget; threads |    | Pageview tracking    |   | Twitter profiles       |
| keyed by page pathname  |    | (treymack.com only)  |   | (plain links)          |
+------------+------------+    +----------------------+   +------------------------+
             | stores threads in
             v
+-------------------------------+
| [External System]             |
| GitHub Discussions            |
| treymack/treymack.github.io   |
| category: Announcements       |
+-------------------------------+

Legend:  +====+ system in scope    +----+ person / external system
```

</details>

## Containers

```mermaid
%%{init: {"flowchart": {"wrappingWidth": 320}}}%%
flowchart TB
  reader["<b>Reader</b><br/>[Person]"]
  author["<b>Author (Trey Mack)</b><br/>[Person]"]

  subgraph blog["Trey Mack Blog [Software System]"]
    content["<b>Content Store</b><br/>[Container]<br/>Markdown/MDX + co-located images<br/>src/content/{blog,about}/<br/>schema: src/content.config.ts"]
    ssg["<b>Static Site Generator</b><br/>[Container]<br/>Astro 5 + MDX + Tailwind v4, Node 20<br/>src/pages/, layouts/, components/,<br/>utils/; RSS + sitemap integrations"]
    site["<b>Static Website</b><br/>[Container]<br/>GitHub Pages, www.treymack.com<br/>HTML, CSS, images,<br/>feed.xml, sitemap-index.xml"]
    client["<b>Client Scripts</b><br/>[Container: JS]<br/>runs in the browser:<br/>ClientRouter view transitions<br/>Giscus loader, re-run per navigation<br/>About page random entry<br/>Google Analytics snippet"]
  end

  giscus["<b>Giscus</b><br/>[External System]<br/>threads keyed by pathname"]
  ga["<b>Google Analytics</b><br/>[External System]"]
  actions["<b>GitHub Actions</b><br/>[External System]<br/>ci.yml: build + tests on PRs<br/>deploy.yml: on push to master, runs<br/>the build and uploads dist/ to Pages<br/>dependabot-auto-merge.yml: merges<br/>non-major Dependabot PRs after CI"]
  discussions["<b>GitHub Discussions</b><br/>[External System]<br/>treymack/treymack.github.io<br/>category: Announcements"]

  reader -->|"browses the site,<br/>reads RSS (HTTPS)"| client
  author -->|"writes posts,<br/>opens PRs"| content
  content -->|"read at build time"| ssg
  ssg -->|"emits dist/"| site
  site -->|"delivers"| client
  actions -->|"runs"| ssg
  client -->|"loads widget"| giscus
  client -->|"pageviews"| ga
  giscus -->|"stores threads in"| discussions

  classDef person fill:#08427b,stroke:#052e56,color:#fff
  classDef container fill:#438dd5,stroke:#2e6295,color:#fff
  classDef external fill:#8a8a8a,stroke:#6b6b6b,color:#fff
  class reader,author person
  class content,ssg,site,client container
  class giscus,ga,actions,discussions external
  style blog fill:none,stroke:#0b4884,stroke-width:2px,stroke-dasharray:6 4
```

<details>
<summary>ASCII version</summary>

```text
  +----------------------+                                            +------------------------------+
  | [Person]             |                                            | [Person]                     |
  | Reader               |                                            | Author (Trey Mack)           |
  +-----------+----------+                                            +---------------+--------------+
              |                                                                       |
              | browses the site,                                                     | writes posts,
              | reads RSS (HTTPS)                                                     | opens PRs
+=============|== Trey Mack Blog [Software System] ===================================|================+
|             |                                                                       v                |
|             |                                           +--------------------------------------+     |
|             |                                           | Content Store            [Container] |     |
|             |                                           | Markdown/MDX + co-located images     |     |
|             |                                           | src/content/{blog,about}/            |     |
|             |                                           | schema: src/content.config.ts        |     |
|             |                                           +-------------------+------------------+     |
|             |                                                               | read at build time     |
|             |                                                               v                        |
|             |                                           +--------------------------------------+     |
|             |                                           | Static Site Generator    [Container] |     |
|             |                                           | Astro 5 + MDX + Tailwind v4, Node 20 |runs |
|             |                                           | src/pages/, layouts/, components/,   |<-+  |
|             |                                           | utils/; RSS + sitemap integrations   |  |  |
|             |                                           +-------------------+------------------+  |  |
|             |                                                               | emits dist/         |  |
|             v                                                               v                     |  |
| +------------------------------------------+            +--------------------------------------+  |  |
| | Client Scripts           [Container: JS] |  delivers  | Static Website           [Container] |  |  |
| | runs in the browser:                     |<-----------| GitHub Pages, www.treymack.com       |  |  |
| | <ClientRouter/> view transitions         |            | HTML, CSS, images,                   |  |  |
| | Giscus loader, re-run per navigation     |            | feed.xml, sitemap-index.xml          |  |  |
| | About page random entry                  |            +--------------------------------------+  |  |
| | Google Analytics snippet                 |                                                      |  |
| +-----------+----------------------------+-+                                                      |  |
|             | loads widget               | pageviews                                              |  |
+=============|============================|========================================================|==+
              |                            |                                                        |
              v                            v                                                        |
+---------------------------+  +----------------------+     +----------------------------------------+
| [External System]         |  | [External System]    |     | [External System]                      |
| Giscus                    |  | Google Analytics     |     | GitHub Actions + Dependabot            |
| threads keyed by pathname |  +----------------------+     | ci.yml: build + tests on PRs           |
+-------------+-------------+                               | deploy.yml: on push to master, runs    |
              | stores threads in                           | the build and uploads dist/ to Pages   |
              v                                             +----------------------------------------+
+-------------------------------+
| [External System]             |
| GitHub Discussions            |
| treymack/treymack.github.io   |
| category: Announcements       |
+-------------------------------+

Legend:  +====+ system boundary    +----+ person / container / external system
```

</details>

## Keeping this current

Update these diagrams when you add or remove an external service, a content collection, a hosting target, or a GitHub Actions workflow. Changes to individual pages, layouts, components, or utils don't need a diagram update. That level of detail is left out on purpose because it changes too often.
