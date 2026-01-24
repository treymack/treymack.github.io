---
layout: post
title:  "Using Get-ADObject from PSCX to list members of an AD Group"
date:   2017-06-30
categories: powershell activedirectory
---

Sometimes you need to list the members of an AD group, and either you don't have the AD tools installed, or they won't load on your machine because your monitor's resolution is too low. I'll let you guess which of these stopped me from loading the GUI. :sob:

We have PowerShell though, and the Community Extensions for PowerShell (PSCX), and they've wrapped AD access in a CmdLet named Get-ADObject.

<!--more-->

So here's how we can get the information of the group we're interested in.

``` powershell
> Get-ADObject -Filter '(&(objectClass=group)(name=group-name))'
distinguishedName : {CN=group-name,OU=...}
Path              : LDAP://CN=group-name,OU=...
```

And now that we have that distinguishedName, we can use it in another query to get users that are a memberOf that group. Let's present it in a nice GridView also.

``` powershell
> Get-ADObject -Filter ('(memberOf=' + (Get-ADObject -Filter '(&(objectClass=group)(name=group-name))').distinguishedName.ToString() + ')') |
  select Name, Username, Path |
  Out-GridView
```

