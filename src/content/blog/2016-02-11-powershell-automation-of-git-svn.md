---
layout: post
title:  "PowerShell Automation of git-svn"
date:   Feb 11, 2016
categories: powershell git svn git-svn
---

<img src="http://www.commitstrip.com/wp-content/uploads/2013/11/Strips-_Old-650-finalfinal1.jpg" alt="" />

<a title="http://www.commitstrip.com/en/2013/11/05/git-svn-ou/" href="http://www.commitstrip.com/en/2013/11/05/git-svn-ou/">http://www.commitstrip.com/en/2013/11/05/git-svn-ou/</a>

Once you get frustrated with versioning via folder copies, you’ll have to decide what Version Control System to use. Subversion (svn) is a workhorse of a centralized version control system, and still very popular. I prefer to work with a Distributed VCS, and git is my choice there. <a href="http://git-scm.com/docs/git-svn">git-svn</a> is the way you can use git as your client to a svn repository.

<!--more-->

Working with git locally means I can create local branches to work in, commit small changes locally, and push the commits to the svn server in batches when I'm ready to share my changes. Let's start working in a new feature branch.

```bash
git checkout -b _featurebranch_
# do work
git add --all
git commit -m "Did work"
```

I have committed some changes locally and noticed that Mary made pushed some changes of her own to the svn server. Now I need to integrate those changes into my local feature branch to make sure my new code will work with her changes. There's a little dance though that we have to do each time we want to pull or push changes. It goes something like this.

```bash
git checkout master
git svn rebase
git checkout _featurebranch_
git rebase master
```

That gets pretty tedious though, so I wrapped it all up in a PowerShell script.

```powershell
Pull-GitSvn
```

There's a similar dance to perform when pushing a branch's changes up to svn. It's even more cumbersome because we need a linear history (which is a nice thing to see anyway even if you're pushing to a git server). Something along these lines.

```bash
git checkout master
git svn rebase
git checkout _featurebranch_
git rebase master
git checkout master
git merge branch
git svn dcommit
git branch -d _featurebranch_
```

Whew! Here's what I call though.

```powershell
Push-GitSvn
```

I have created these functions in my $PROFILE so they're always available. They depend on <a href="http://dahlbyk.github.io/posh-git/">posh-git</a>, which you'll want anyway if you're using git with PowerShell. Just add these functions after the call to initialize posh-git in your $PROFILE file.

```powershell
function Pull-GitSvn
{
    $status = Get-GitStatus
    if ($status.HasWorking) {
        throw "Current git folder has working changes that must be committed first"
    }

    if ($status.Branch -ne "master") { git checkout master }
    git svn rebase
    if ($status.Branch -ne "master") {
        git checkout $status.Branch
        git rebase master
    }
}

function Push-GitSvn
{
    Pull-GitSvn

    $status = Get-GitStatus
    if ($status.HasWorking) {
        throw "Current git folder has working changes that must be committed first"
    }

    if ($status.Branch -ne "master") {
        git checkout master
        git merge $status.Branch
        git branch -d $status.Branch
    }
    git svn dcommit
}
```

There's some bonus checks in there that will try to keep you from getting into an error state if you have uncommitted changes, and a check that makes the same calls work from master so you can use it there too!

Let me know if these are helpful, or if you have any suggestions for improvements. Until next time.
