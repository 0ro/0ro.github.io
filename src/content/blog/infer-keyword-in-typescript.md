---
author: Raman Nikitsenka
pubDatetime: 2023-08-22T22:13:56Z
title: "📜 Infer keyword in TypeScript"
postSlug: infer-keyword-in-typescript
featured: true
draft: false
tags:
  - typescript
  - react
ogImage: ""
description: "TypeScript's infer keyword is your secret weapon for effortlessly deducing types, simplifying code, and unlocking the full potential of type inference. In this article, we'll explore how infer can make your TypeScript development smoother and more efficient."
---

TypeScript's **infer** keyword is your secret weapon for effortlessly deducing types, simplifying code, and unlocking the full potential of type inference. In this article, we'll explore how infer can make your TypeScript development smoother and more efficient. 🚀

Type inference in TypeScript is used to provide type information when there is no explicit type annotation. This usually occurs when you haven't added types to your variables:

```ts
let str = "Hello, World!"; // str is a string here
```

Everything is fine with this; TypeScript handles it for you. 👍

If you want to try type inference yourself you can use the **infer** keyword, and it will look like this:

```ts
let str = "Hello, World!"; // str is a string

type GetType<T> = T extends infer S ? S : never;
type T1 = GetType<typeof str>; // string
```

Of course, this example may seem strange and not interesting, but it can give you an idea of how the **infer** keyword can be used later. 🤔

As you can see, we used **infer** within **a conditional** statement, and this is a limitation of using **infer** in TypeScript. Also, you **cannot** use it outside of an **extends** clause.

If you want to extract the type of an element inside an array, you can do it like this:

```ts
let arr = [1, 2, 3];

type GetTypeOfArrayElement<T> = T extends (infer S)[] ? S : never;

type T1 = GetTypeOfArrayElement<typeof arr>; // number
```

Here, the **infer** keyword allows you to extract the type within the array and then use it. It's like defining a reference that you can use later.

That example, also might not seem very interesting because, in the end, you can achieve the same with this approach:

```ts
type T2 = (typeof arr)[0]; // number
```

However, TypeScript has more complex structures that you cannot work around with simple syntax. Let's consider promises. What if you need to determine the type of the value returned by a promise? Here is where **infer** can also help you:

```ts
let promise = Promise.resolve([1, 2, 3]); // Promise<number[]>

type GetTypeOfPromise<T> = T extends Promise<infer S> ? S : never;

type T1 = GetTypeOfPromise<typeof promise>; // number[]
type T2 = GetTypeOfPromise<Promise<number>>; // number
type T3 = GetTypeOfPromise<Promise<string[]>>; // string[]
```

By the way, Typescript itself already have a built-in utility for it that has more powerful functionality 👏:

```ts
type T4 = Awaited<typeof promise>; // number[]
```

Let's go further. The gaining access to function arguments can be defined like this:

```ts
type GetTypeOfFirstArgument<T> = T extends (arg: infer U, ...args) => any
  ? U
  : never;

type T1 = GetTypeOfFirstArgument<typeof document.getElementById>; // string
type T2 = GetTypeOfFirstArgument<(arg1: string, arg2: number) => void>; // string
```

And in the end, maybe the most practical example with React component function.

It can happen that in some libraries, they didn't export the props for their component. But in your code, you really need it. So with **infer** keyword getting the prop type is possible, and will look like this:

```ts
const OutsideComponent: React.FC<{ name: string }> = () => null;

type InferProps<T> = T extends React.FC<infer P> ? P : never;

type Props = InferProps<typeof OutsideComponent>;
```

This technique allows you to infer the prop types of a React component function even if they aren't explicitly exported

## Conclusion

Incorporating **infer** into your TypeScript toolkit can significantly streamline your code, simplify complex type manipulations, and boost your development productivity. Embrace this powerful keyword to unlock the true potential of type inference in TypeScript. Happy coding! 🚀
