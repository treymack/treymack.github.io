---
layout: post
title:  "Get More Value from your Test Asserts"
date:   2017-04-05
categories: testing
---

![Assert](/images/assert-sign-photoshopped.jpg)

There's more than one way to skin an assertion. The thing to keep in mind is how the next developer (obligatory "or you in 6 months") is going to use the information if an assertion fails.

<!--more-->

We'll be using MSTest to describe the situation, but this is just as valid in NUnit.

# The Land of Confusion

You run your test suite and spot an error. Let's dig into the error message.

> Result Message:	Assert.IsTrue failed.

Hm, not much to dig into. Let's go to the line of the failed assertion.

```csharp
Assert.IsTrue(actual.Count == 1);
```

This doesn't tell us much. It's certianly better than nothing, because at least we know there's something to investigate. But what was the value of `actual.Count`? `0`? `2`? A `million bajillion`? We can't tell from the error message.

# An Improvement

All XUnit testing frameworks I know of have a more explicit way to test against a certain expected value. In their most basic form, it's usually a call to a method like `Assert.AreEqual`. Let's switch to that.

```csharp
Assert.AreEqual(1, actual.Count);
```

We rerun the test suite and see the following error message.

> Result Message:	Assert.AreEqual failed. Expected:<1>. Actual:<0>.

That's about as good as we can do since we're discovering the error and don't know much about why it's important.

![If I Could Turn Back Time](/images/cher-if-i-could-turn-back-time.jpg)

If we could turn back time though...

# Don't Make Me Think

We have all this context when we're writing a test, let's forward that info to our future selves. Just what are we doing here?

```csharp
Assert.AreEqual(1, actual.Count,
    "We expect 1 match because we ignore DOB when matching");
```

> Result Message:	Assert.AreEqual failed. Expected:<1>. Actual:<0>. We expect 1 match because we ignore DOB when matching

Future self thanks past self. Maintenance time cut in half, at least.

# Is There More?

From what I've seen, this is about as good as you can do with the build-in assertion libraries in MSTest. NUnit has its [Constraint Model](https://github.com/nunit/docs/wiki/Constraint-Model) (Assert.That) that can allow for more expressive asserts.

![We need to go deeper](/images/we-need-to-go-deeper.jpg)

If you want to go deeper, check out [FluentAssertions](http://fluentassertions.com/) and [Shouldly](http://shouldly.readthedocs.io/en/latest/).

