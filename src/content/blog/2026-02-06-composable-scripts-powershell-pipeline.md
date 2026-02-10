---
title: "Composable Scripts and the PowerShell Pipeline"
date: 2026-02-10
description: "A look back at a 2016 PowerShell tool for FluentMigrator that turned out to be a great example of composable scripts and pipelines. What worked, what didn't, and why the pattern still holds up today."
tags: ["powershell", "database", "devops", "fluentmigrator"]
---

Back in 2016 I wrote a small PowerShell library called [posh-fluent-migrator](https://github.com/treymack/posh-fluent-migrator). The goal was simple: automate the repetitive parts of managing a [FluentMigrator](https://fluentmigrator.github.io/) project. Build the migration assembly, create the local database, run migrations, test rollbacks.

What I didn't call focus to at the time was that the interesting part wasn't the scripts themselves. It was how they were meant to be used together.

<!--more-->

## The Setup

The project had a handful of scripts, each doing exactly one thing:

- `Get-MigrationProject.ps1` - find and return the migration project config
- `Invoke-MsBuild.ps1` - build it
- `Create-LocalDatabase.ps1` - create the local SQL Server database
- `Migrate-LocalDatabase.ps1` - run migrations up (or down)
- `Restore-NuGetPackage.ps1` - restore dependencies
- `New-Migration.ps1` - scaffold a new migration file

Nothing special on their own. The interesting part was the usage:

```powershell
# Full setup from scratch
.\scripts\Get-MigrationProject.ps1 |
    .\scripts\Invoke-MsBuild.ps1 |
    .\scripts\Create-LocalDatabase.ps1 -DropDatabaseIfExists |
    .\scripts\Migrate-LocalDatabase.ps1
```

And for testing your latest migration and its rollback:

```powershell
.\scripts\Get-MigrationProject.ps1 project-name |
    .\scripts\Invoke-MsBuild.ps1 |
    .\scripts\Migrate-LocalDatabase.ps1 |
    .\scripts\Migrate-LocalDatabase.ps1 -Rollback |
    .\scripts\Migrate-LocalDatabase.ps1
```

That last one runs migrations up, then down, then up again. If your rollback is broken, you know right then instead of in production.

## What Made It Work

PowerShell pipelines pass **objects**, not text. Unlike Unix pipes where you're parsing stdout strings, each script in this chain received a structured object from the previous one - the project name, paths, connection strings. No parsing, no fragile string splits.

Each script was designed with a single responsibility and a predictable input/output contract. That's what made them composable. You could drop any script out of the chain, swap the order where it made sense, or add new scripts without touching existing ones.

## Worth Revisiting?

If you're still on FluentMigrator and doing manual migration runs, this pattern is worth considering. The scripts are short enough to read in a few minutes and easy to adapt.

More broadly, if you find yourself writing long one-off automation scripts, ask whether the logic could be split into smaller composable pieces. A pipeline of five short scripts is easier to debug, test, and reuse than one 200-line monster.

The core idea of composable scripts and pipelines is timeless. The tools have evolved, but the pattern still holds up. It's a reminder that sometimes the best solutions are the simplest ones, even if they don't look flashy on a README.
