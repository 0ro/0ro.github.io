---
author: Raman Nikitsenka
pubDatetime: 2023-08-31T18:16:02Z
title: "📜 Length of String in TypeScript"
postSlug: length-of-string-in-typescript
featured: false
draft: false
tags:
  - typescript
ogImage: ""
description: "I'm very like typescript and I always try to learn something interesting there. I thought that it is **impossible** to know the length of the string in typescript, but I was wrong. Today during solving typescript challenge I found a way to do it."
---

I'm very like typescript and I always try to learn something interesting there. I thought that it is **impossible** to know the length of the string in typescript, but I was wrong. Today during solving typescript challenge I found a way to do it. If you don't know about typescript challenges, you can read about it [here](https://github.com/type-challenges/type-challenges), it is a very interesting project, and I highly recommend you to try it, if you, like me, obsessed with typescript.

Let's start with example where in real life it can be useful. Imagine you have a function for getting a country by its code, and you want that function to accept only strings with length 2. It will be nice to have something like this:

```ts
function getCountryByCode<T extends string>(code: isLength<T, 2>) {
  return "Belarus";
}

getCountryByCode("BY"); // "Belarus"
```
In the code above we declared a generic type `T` which extends `string` and we want to check that the length of this string is equal to 2. Unfortunately, typescript doesn't have a built-in type for getting the length of the string, but if it had, it would look like this:

```ts 
type IsLength<S extends string, N extends number> = Length<S> extends N ? true : false;
```
You can see here that I declared a generic type that accepts two parameters, and then I'm using the `Length` type to get the length of the string and compare it with the second parameter via `extends` keyword.

But `Length` type doesn't exist in typescript, so we need to create it by ourselves. There is a trick that allows us to do it. We can use the `infer` keyword to get the length of the string. If you don't know how infer keyword works in Typescript I can recommend you my article about it [here](https://0ro.github.io/posts/infer-keyword-in-typescript/). So let's create our `Length` type:

```ts
type StringToTuple<S extends string> = S extends `${infer Char}${infer Rest}` ? [Char, ...StringToTuple<Rest>] : [];

type Length<S extends string> = StringToTuple<S>["length"];
```

It's crazy, right? But let me explain how it works.

First of all, we need to convert our string to tuple, and we can do it with the `StringToTuple` type. It accepts a generic type `S` which extends `string` and then we are using the `infer` keyword inside the template literal type, that allows us to get the first character of the string and the rest of the string. Then we use the spread operator to add the first character to the tuple and call the `StringToTuple` type again with the rest of the string. We are doing it until the string is empty, and then we return an empty array.

It means that if we have a string like `"BY"` it will be converted to the tuple `["B", "Y"]`. And then we can get the length of the tuple with the `Length` type, it is possible because the tuple type knows exactly how many elements it has. You can read more about tuples [here](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types).

So, the full way to get the length of the string will look like this:

```ts
type StringToTuple<S extends string> = S extends `${infer Char}${infer Rest}` ? [Char, ...StringToTuple<Rest>] : [];

type Length<S extends string> = StringToTuple<S>["length"];

type IsLength<S extends string, N extends number> = Length<S> extends N ? true : false;
```

So, but I'm not done yet, based on this we already can create more utility types:

```ts
// check if string is empty
type IsEmpty<S extends string> = IsLength<S, 0>;

// check if string is not empty
type IsNotEmpty<S extends string> = IsLength<S, 0> extends true ? false : true;

// check if string is shorter than N
type IsShorter<S extends string, N extends number> = IsLength<S, N> extends true ? true : false;

// check if string is longer than N
type IsLonger<S extends string, N extends number> = IsLength<S, N> extends true ? false : true;
```

Honestly I don't know we're it can be useful, but it is possible to do it, and it is cool. 😎

On my projects I have a special place for my utility types. It is pretty handy and I always can hope that they will be useful in the future. So, I added this types to my utility types, and I hope that they will be useful for you too.

I hope you enjoyed this article, and if you have any questions or suggestions, please feel free to ask.












