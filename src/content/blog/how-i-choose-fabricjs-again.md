---
author: Raman Nikitsenka
pubDatetime: 2023-09-03T18:42:04Z
title: "How I choose Fabric.js again"
postSlug: how-i-choose-fabricjs-again
featured: false
draft: false
tags:
  - react
  - scss
  - css
ogImage: ""
description: "If you don't know, Fabric.js is the library that helps you manipulate canvas elements in the browser and even on Node.js servers. It is very popular and has more than 25.7k stars on GitHub (one of them from me). But is it still the best option that exists? I tried to find out."
---

If you don't know, Fabric.js is the library that helps you manipulate canvas elements in the browser and even on Node.js servers. It is very popular and has more than 25.7k stars on GitHub (one of them from me). But is it still the best option that exists? I tried to find out.

## Why do we need libraries?

I can advise using canvas libraries, and even **any library**, in two main cases:

1. When you create something simple.
2. When you create something that is very complicated.

![normal distribution](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7w7px25s07ly9mghewu9.png)

When you try to create something that is **simple**, you usually don't need to use any libraries at all. In our case, you can start with the native built-in Canvas API for browsers or use the [canvas](https://www.npmjs.com/package/canvas) npm package, which allows you to use the same API on the Node.js environment.

This option is also valid if you want to learn something new, like Server Sent Events, Websockets, or the Canvas API. Starting with learning a library's API before the native API is always a bad idea. From a long-term perspective, it puts you in a losing situation. It's similar to learning JQuery before JavaScript or React.js before JavaScript. It will be difficult for you to sell your expertise in the future and help you with onboarding in any new library.

When you create something that is **complicated**, use the native API. This case is valid if you're trying to create something like Figma, Excalidraw, Miro, or something else that requires a new approach to working with graphics on the web. From a business perspective, it will be much easier and even cheaper to create your own library that is definitely based on the native Canvas API and covers your internal demand. Open-source libraries are sometimes not very customizable.

So, both cases favor the native API. For projects in the middle, you **can** use the built-in API too, but it will probably cost you a lot of resources. I'm sure everyone remembers that bad feeling when one day you decided to create your own Select, Datepicker, or Checkbox on a commercial project, and something went wrong with them because you didn't figure out how many edge cases you needed to cover in your code. The same applies here: if you're working on a commercial project and your task is not very simple, first consider using an open-source library. Only if you didn't find something that is really needed for your project should you then switch to a hand-made solution (or take the opportunity to create your own open-source package because you've found something that doesn't exist).

Defining the simplicity of your task or project is up to you. It is a subjective term, of course, and it depends on your experience. You can expedite gaining experience faster by reading articles and watching videos about programming. People are sharing their experience for free; please use it.

This is a fundamental concept that everyone should know. Let's continue.

## My first time with Fabric.js

![First time](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jx9owpw32lhu4fjz4gb6.png)

It wasn't like on the picture; it wasn't comparable to hanging, but it wasn't a great time for me. Because I made that mistake, I started learning the Fabric.js API before I was very familiar with all the concepts of the native canvas API. But, to be fair, Fabric.js is very friendly for geniuses like me. I almost never touched the canvas API on that project because everything was already implemented in Fabric.js. It's good for a library, right? And, of course, during the investigation of some bugs, I learned the Canvas API anyway because if you think you can avoid something, fate will surely punish you.

## High-level architecture

So, after 7 years, I needed a library again for creating a graphic editor. One of the requirements was a Canvas-based approach. So, of course, I considered using Fabric.js because I was already very familiar with it. But I wanted to discover the current state of affairs in the world of Canvas-based libraries on the web and check the state of Fabric.js.

First of all, don't even think about libraries that are bound to some popular frontend framework like React.js, Vue.js, and others. You don't need them because you will still use only `<canvas>` there and somehow connect it to your desired canvas library. The high-level architecture for such an editor can look like this:

![High-level arch diagram](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/47tj7l9jkplyp2tzu3w1.png)

From left to right, you can see:

1. Frontend framework, it can be anything you use, React.js, Vue.js, and others, or you can even avoid using frameworks altogether.
2. Editor component. A component where you're going to store your canvas tag, and where you are going through your state management to initialize your library.
3. State management. Here, you can use anything you want to sync the canvas state with your component state. It can be Zustand, MobX, Jotai, or even Redux.
4. Adapter is going to store the methods and properties that you will use to describe the logic for your Canvas Library and customize the standard behavior of that library.

Now, we can focus on finding the Canvas-based library.

## Some libraries are dead

There are a lot of libraries that work with the Canvas API, and I would divide them into two big groups:

1. Visualization libraries.
2. Whiteboard/drawing libraries.

Visualization libraries are the ones that help you with visualizing your data on canvas or animating it to make it more like a game. So, they are not my case.

Whiteboard/drawing libraries are what I'm looking for to create my graphic editor.

I don't have all the time in the world to check and try each library because the real development experience of working with a library is the most important and valuable. Only when you create something using a library you see its problems and limitations. So, as I said, I don't have time. Instead of creating a proof of concept with every library, I tried to find all the candidates and make a decision based on these points:

- Open-source
- GitHub stars
- NPM downloads
- Stack Overflow questions
- Date of the last release
- Documentation

Based on this, I found that some of the libraries are dead and no longer have any support. Only two libraries are still alive and have significant amount of stars on GitHub and downloads on NPM. They are [Fabric.js](https://github.com/fabricjs/fabric.js) and [Konva.js](https://github.com/konvajs/konva).

|                              | Fabric.js   | Konva.js     |
| ---------------------------- | ----------- | ------------ |
| **GitHub stars**             | 25.7k       | 9.7k         |
| **NPM downloads**            | 140,574     | 276,004      |
| **Stack Overflow questions** | 9,806       | 986          |
| **Date of the last release** | 2 weeks ago | 3 months ago |
| **Documentation**            | Good        | Good         |

## Conclusion

As you can see, Fabric.js is dominating in all metrics. The most interesting moment is that they are preparing a new release with a lot of new features, which is a very good sign because it means that the library is still alive and has a lot of contributors.

I would really like to try Konva.js too, but I don't have time for it, and I'm not sure that it will be better than Fabric.js. So, I decided to use Fabric.js, and after a few months of active usage I have no regrets about it.
