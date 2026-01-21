---
layout: post
title:  "Value Equality from a Subset of Properties in C#"
date:   Jan 7, 2016
categories: csharp
---

> It's what's inside that counts.

The default comparison for equality in .Net, when comparing reference types, uses reference equality. The `==` operator compares the two class references and if they are the same instance (have a pointer to the same address in memory), returns true. Otherwise false.

In most of my day-to-day, however, I'd prefer to use value equality. That's comparing the values of the properties of 2 instances of a class to determine equality.

<!--more-->

Actually, I'd like to go one step further. I don't want to compare all the properties of the class instances, just the ones that I determine indicate identity. So I whipped up a little interface `IStructurallyIdentifiable<T>` to help us out towards this goal. Implementers of this interface determine which properties determine identity for the class.

It is VERY important that the implementing class override `Equals` and `GetHashCode`. The compiler will force you to implement `Equals<T>`, and that will be enough for one-to-one comparisons, but if you want to use LINQ to Objects to handle equality comparisons of collections (think `.Union`, `.Intersect`, and `.Except`), you'll need to override the implementations of `.Equals `and `.GetHashCode`. See the Phone class for an example.

```csharp
public interface IStructurallyIdentifiable<T> : IEquatable<T>
{
    IEnumerable<Expression<Func<T, object>>> GetIdentityProperties();
}
```

```csharp
public class Phone : IStructurallyIdentifiable<Phone>
{
    // Values that determine identity for type Phone.
    public string TypeCode { get; set; }
    public string Number { get; set; }
    
    // Audit properties, not used to determine identity
    public DateTime CreatedAt { get; set; }
    public int CreatedBy { get; set; }
    public DateTime ModifiedAt { get; set; }
    public int ModifiedBy { get; set; }
    
    public static Phone Create(string typeCode, string number)
    {
        return new Phone
        {
            TypeCode = typeCode,
            Number = number,
        };
    }

    public IEnumerable<Expression<Func<Phone, object>>> GetIdentityProperties()
    {
        yield return x => x.TypeCode;
        yield return x => x.Number;
    }

    public bool Equals(Phone other) => this.EqualsImpl(other);
    public override bool Equals(object obj) => this.EqualsImpl(obj);
    public override int GetHashCode() => this.GetHashCodeImpl();

    public override string ToString() => $"{TypeCode} => {Number}";
}
```

```csharp
public static class StructurallyIdentifiableExtensions
{
    public static bool EqualsImpl<T>(this T self, object other)
        where T : IStructurallyIdentifiable<T>
    {
        if (self == null && other == null ) { return true; }
        if (self == null || other == null) { return false; }
        var t = typeof(T);
        foreach (var accessor in self.GetIdentityProperties())
        {
            var memberName = StaticReflection.GetMemberName(accessor);
            var property = t.GetProperty(memberName);
            if (!Equals(property.GetValue(self), property.GetValue(other))) { return false; }
        }

        return true;
    }

    /// <summary>
    /// http://stackoverflow.com/a/263416/237012
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="self"></param>
    /// <returns></returns>
    public static int GetHashCodeImpl<T>(this T self)
       where T : IStructurallyIdentifiable<T>
    {
        unchecked // Overflow is fine, just wrap
        {
            int hash = (int)2166136261;

            foreach (var accessor in self.GetIdentityProperties())
            {
                var value = accessor.Compile()(self);

                if (value != null)
                {
                    hash = hash * 16777619 ^ value.GetHashCode();
                }
            }
            return hash;
        }
    }
}
```

One last note - if you're looking for an implementation of the StaticReflection class, it's in the following snippet, copied from <a href="http://joelabrahamsson.com/getting-property-and-method-names-using-static-reflection-in-c/">Joel Abrahamsson's</a> blog.

```csharp
/// <summary>
/// http://joelabrahamsson.com/getting-property-and-method-names-using-static-reflection-in-c/
/// </summary>
public static class StaticReflection
{
    public static string GetMemberName<T, TValue>(
        this T instance,
        Expression<Func<T, TValue>> expression)
    {
        return GetMemberName(expression);
    }

    public static string GetMemberName<T, TValue>(
        Expression<Func<T, TValue>> expression)
    {
        if (expression == null)
        {
            throw new ArgumentException(
                "The expression cannot be null.");
        }

        return GetMemberName(expression.Body);
    }

    public static string GetMemberName<T>(
        this T instance,
        Expression<Action<T>> expression)
    {
        return GetMemberName(expression);
    }

    public static string GetMemberName<T>(
        Expression<Action<T>> expression)
    {
        if (expression == null)
        {
            throw new ArgumentException(
                "The expression cannot be null.");
        }

        return GetMemberName(expression.Body);
    }

    private static string GetMemberName(
        Expression expression)
    {
        if (expression == null)
        {
            throw new ArgumentException(
                "The expression cannot be null.");
        }

        if (expression is MemberExpression)
        {
            // Reference type property or field
            var memberExpression =
                (MemberExpression)expression;
            return memberExpression.Member.Name;
        }

        if (expression is MethodCallExpression)
        {
            // Reference type method
            var methodCallExpression =
                (MethodCallExpression)expression;
            return methodCallExpression.Method.Name;
        }

        if (expression is UnaryExpression)
        {
            // Property, field of method returning value type
            var unaryExpression = (UnaryExpression)expression;
            return GetMemberName(unaryExpression);
        }

        throw new ArgumentException("Invalid expression");
    }

    private static string GetMemberName(
        UnaryExpression unaryExpression)
    {
        if (unaryExpression.Operand is MethodCallExpression)
        {
            var methodExpression =
                (MethodCallExpression)unaryExpression.Operand;
            return methodExpression.Method.Name;
        }

        return ((MemberExpression)unaryExpression.Operand)
            .Member.Name;
    }
}
```

Thanks for reading! If you have any suggestions for improvements, please add a comment or hit me up on <a href="https://twitter.com/trey_mack">Twitter</a>!
