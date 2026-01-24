---
layout: post
title:  "Registry Hacks! IsInstallationInProgress"
date: 2015-09-18
categories: visualstudio hacks powershell
---

I was doing a repair on Visual Studio 2015 and it seemed to be stuck at the end, installing an Android emulator IIRC. I killed the installer and fired up VS and saw a very practical error message:

<blockquote>Repair/Modify operation did not finish successfully. Please repair Visual Studio before continuing. You may continue to run Visual Studio, but operation may not be reliable.</blockquote>

<!--more-->

But I had work to do and was pretty confident that VS in its current state would take me through the day. I had to jump between a couple different projects that day and each time I would see:

<img src="/vs2015-setup-error.png" alt="Repair/Modify Image" />

How do I disable this message box? Registry Hack Time! Here's the PowerShell script I used. (I like PowerShell)

```powershell
Push-Location
Set-Location HKLM:\SOFTWARE\Wow6432Node\Microsoft\VisualStudio\14.0\Setup\VS
# Change .\community to .\enterprise or .\professional if you use one of those SKUs
Set-ItemProperty .\community IsInstallInProgress 0
Pop-Location
```

Of course, at some point I'll have to rerun the repair, but this got me back to work!
