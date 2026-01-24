---
layout: post
title:  "Install OpenSSL on Windows using Chocolatey"
date:   Oct 28, 2015
categories: chocolatey powershell
---

![SCRIPT ALL THE THINGS!](https://s3.amazonaws.com/media-p.slid.es/uploads/gonzalocasas/images/533024/intro-meme.jpg)

The Windows binaries that the [OpenSSL project](https://www.openssl.org) will point you to are linked from [this page](https://www.openssl.org/community/binaries.html). But I sure do like installing all the things via [Chocolatey](https://chocolatey.org)these days. Currently there's no Chocolatey package for OpenSSL.

<!--more-->

I do have it available on my main Windows computer's command line.. Now how did it get there?

```powershell
Get-Command openssl.exe | select Path

Path
----
C:\Program Files\OpenVPN\bin\openssl.exe
```

Oh there it is under [OpenVPN](https://openvpn.net/), now I DO see a [Chocolatey package for that](https://chocolatey.org)!

OK, now to install OpenVPN via Chocolatey.

```powershell
cinst openvpn
```

And now I'll have to add the bin folder to the %PATH%.

```powershell
C:\Program Files\OpenVPN\bin
```

And we're done!

Todo:

* Create Chocolatey package for OpenSSL.
