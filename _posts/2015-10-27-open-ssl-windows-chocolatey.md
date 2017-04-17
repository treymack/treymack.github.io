---
layout: post
title:  "Install OpenSSL on Windows using Chocolatey"
date:   Oct 28, 2015
categories: chocolatey powershell
---

<blockquote><img class="alignnone" src="https://s3.amazonaws.com/media-p.slid.es/uploads/gonzalocasas/images/533024/intro-meme.jpg" alt="SCRIPT ALL THE THINGS!" width="400" height="300" /></blockquote>
The Windows binaries that the <a href="https://www.openssl.org">OpenSSL project</a> will point you to are linked from <a href="https://www.openssl.org/community/binaries.html">this page</a>. But I sure do like installing all the things via <a href="https://chocolatey.org">Chocolatey </a>these days. Currently there's no Chocolatey package for OpenSSL.

<!--more-->

I do have it available on my main Windows computer's command line.. Now how did it get there?

{% highlight powershell %}
Get-Command openssl.exe | select Path

Path
----
C:\Program Files\OpenVPN\bin\openssl.exe
{% endhighlight %}

Oh there it is under <a href="https://openvpn.net/">OpenVPN</a>, now I DO see a <a href="https://chocolatey.org">Chocolatey package for that</a>!

OK, now to install OpenVPN via Chocolatey.

{% highlight powershell %}
cinst openvpn
{% endhighlight %}

And now I'll have to add the bin folder to the %PATH%.

{% highlight powershell %}
C:\Program Files\OpenVPN\bin
{% endhighlight %}

And we're done!

Todo:

* Create Chocolatey package for OpenSSL.
