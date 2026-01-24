---
layout: post
title:  "Configuring HTTPS Bindings in IIS"
date:   2017-07-25
categories: iis certificates ssl
---

> I have my web application serving through HTTP over port 80, but the customers require data to be sent security through HTTPS.
> 
> How would I go about setting up this application as HTTPS over port 443 in IIS?

<!--more-->

# The GUI Way (inetmgr)

![Select WebSite Node and Click Bindings ...](/2017-07-25-iis-step1.png)

![Click Add, Select HTTPS, Port 443, Select an SSL Certificate](/2017-07-25-iis-step2.png)

