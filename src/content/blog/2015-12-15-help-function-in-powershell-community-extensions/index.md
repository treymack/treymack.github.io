---
layout: post
title:  "help Function in PowerShell Community Extensions"
date: 2015-12-15
categories: powershell
---

> No one is perfect... that's why pencils have erasers.
> 
> - Wolfgang Riebe

**PowerShell is fantastic!** I've been using it as my shell for a couple of years now. I was using the git bash before that, and one thing I missed was using **less** to page data.

When I run `git log` I can count on using <code>d</code> to page down and <code>u</code> to page up, <code>/</code> to search, etc.

<!--more-->

While learning and using PowerShell, I fire up the <code>Get-Help</code> CmdLet quite often to learn details of a particular CmdLet I'm interested in. <code>Get-Help</code> by itself firehoses the data to the console too fast to read, so you'll have to scroll up. A better solution is to pipe the results to <code><strong>more</strong></code>, which allows you to hit <code>Enter</code> to scroll one line at a time or <code>space</code> to scroll a page at a time. But what about scrolling back up? I could do that with <code><strong>less</strong></code>.

```powershell
Get-Help | less
```

I have <code>git</code> installed and <code>C:\Program Files (x86)\Git\bin\less.exe</code> is on my path, so this works! Bit of a pain to pipe it to less each time though. I should just edit the built-in <code>help</code> function and change it from using <code><strong>more</strong></code> to using <code><strong>less</strong></code>.

<blockquote><em>Sometimes less is more.</em></blockquote>

But hey! the team behind <a href="https://pscx.codeplex.com/">Powershell Community Extensions (PSCX)</a> has <a href="https://pscx.codeplex.com/SourceControl/latest#Trunk/Src/Pscx/Modules/Utility/Pscx.Utility.psm1">already done that for me</a>. Thanks! They've even wrapped it up in a function that makes it more PowerShell-friendly. The docs from that function reveal more about enabling and disabling this support.

```powershell
<#
.SYNOPSIS
 Less provides better paging of output from cmdlets.
.DESCRIPTION
 Less provides better paging of output from cmdlets.
 By default PowerShell uses more.com for paging which is a pretty minimal paging app that doesn't support advanced
 navigation features. This function uses Less.exe ie Less394 as the replacement for more.com. Less can navigate
 down as well as up and can be scrolled by page or by line and responds to the Home and End keys. Less also 
 supports searching the text by pressing the "/" key followed by the term to search for then the "Enter" key. 
 One of the primary keyboard shortcuts to know with less.exe is the key to exit. Pressing the "q" key will exit 
 less.exe. For more help on less.exe press the "h" key. If you prefer to use more.com set the PSCX preference 
 variable PageHelpUsingLess to $false e.g. $Pscx:Preferences['PageHelpUsingLess'] = $false
.PARAMETER LiteralPath
 Specifies the path to a file to view. Unlike Path, the value of LiteralPath is used exactly as it is typed. 
 No characters are interpreted as wildcards. If the path includes escape characters, enclose it in 
 single quotation marks. Single quotation marks tell Windows PowerShell not to interpret any characters 
 as escape sequences.
.PARAMETER Path
 The path to the file to view. Wildcards are accepted.
.EXAMPLE
 C:\PS> man about_profiles -full
 This sends the help output of the about_profiles topic to the help function which pages the output.
 Man is an alias for the "help" function. PSCX overrides the help function to page help using either 
 the built-in PowerShell "more" function or the PSCX "less" function depending on the value of the 
 PageHelpUsingLess preference variable.
.EXAMPLE
 C:\PS> less *.txt
 Opens each text file in less.exe in succession. Pressing ':n' moves to the next file.
.NOTES
 This function is just a passthru in all other hosts except for the PowerShell.exe console host.
.LINK
 http://en.wikipedia.org/wiki/Less_(Unix)
#>
```

If you're interested in checking out these community-contributed extensions, <a href="https://pscx.codeplex.com/releases">download the .msi</a> for your version of PowerShell and rock on!
