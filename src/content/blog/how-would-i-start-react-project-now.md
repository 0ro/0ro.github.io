---
author: Raman Nikitsenka
pubDatetime: 2023-08-26T19:04:55Z
title: "🚀 How would I start a React project now? 🤓"
postSlug: how-would-i-start-react-project-now
featured: true
draft: false
tags:
  - react
  - webdev
ogImage: ""
description: "I work at an outsourcing company, and we often have to create projects from scratch. Every time before starting this process, I try to conduct research on what needs to be chosen. Since I have more experience in the React ecosystem, in this article, I would like to answer the question: how would I start a React project now? 🤔"
---

I work at an outsourcing company, and we often have to create projects from scratch. Every time before starting this process, I try to conduct research on what needs to be chosen. Since I have more experience in the React ecosystem, in this article, I would like to answer the question: how would I start a React project now? 🤔

**Disclaimer:** The following article reflects my personal opinions and experiences. Please consider project-specific factors and team expertise when making technology choices.

## Gathering Requirements 📝

Let's imagine that you, like me, are a developer at an outsourcing company or a freelancer, and you have received an order to create a new project. You need to work on the frontend part. Where should you start, and how should you approach choosing a framework? 🧐

### What to Ask? 🤷‍♂️

1. Which browsers need to be supported? 🌐
2. Which devices need to be supported? (mobile, tablets, desktop) 📱💻
3. Language support? 🌎
4. Do you have any design or mockups? The choice of framework depends on this. 🎨
5. Dark theme? 🌙
6. Is there a backend? 🌐
7. Do you need server-side rendering? This is important for SEO. 🚀
8. Tests? 🧪
9. Are there any special integrations with other services or APIs? 🤝
10. Accessibility? ♿

These questions apply to **any** project. This forms the foundation, and from these answers, you can build a dialogue with the client. However, the functional requirements for all applications are different. They will determine the internal content of your project and the architecture of the system's internal parts. For example, if it's a banking application, it will involve many forms, whereas if it's a shopping app, it will have many product cards. If it's a graphic editor, you'll need to think about choosing a library for working with graphics, and so on. In general, gather as much information as possible about the project. 📊

### Common Requirements 📦

Functional requirements differ, but the skeleton of the application is usually the same. Here's an approximate list of what needs to be done in any project:

![Application parts](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8rizc36pabdg3jm6ypvh.png)

- Authentication/Global state ✅
- Routing 🚏
- State management 📂
- UI components 💎
- i18n (internationalization) 🌍
- Styling 🎨
- Linting, formatting 🧹

This is where it gets interesting for me. What tools should you choose for each of these points? 🛠️

![Hard to choose](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/2qupooy5ipecmjv8zkfx.png)

## Frameworks 🛡️

Every time, I start this story from scratch and try to make a fresh decision about the framework.

It's worth mentioning that the choice of framework depends on your team's experience and your own. If you and your team haven't worked on React.js projects before, starting a new project for which you're being paid can be a risky endeavor. If you value your client's money and your reputation, it's better to develop in something you already know well. Save experimentation for your own projects. 💼💡

In my case, I have experience with **create-react-app** and **Vite + React.js**, and unfortunately I've never had a chance for working with **Next.js**. 📚🔍

It seems obvious to everyone that Vite has won in this showdown. But I wouldn't completely dismiss **create-react-app**, and here's why. 🥊

### Create-react-app? 🎉

![CRA](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dcbv8at0wt5ivajqwx4k.png)

In my most recent project, I needed to build an application with micro-frontends. Starting my research in this area, I found that the Vite plugin for supporting Module Federation is not stable. In particular, I faced an [issue](https://github.com/originjs/vite-plugin-federation/issues/294) that is still open, raising doubts about its usage. Meanwhile, **create-react-app** works with Module Federation without any issues. I had to make this difficult decision back then, endure the slow webpack build in favor of stability. 😓

So, at this stage, if you need Module Federation support, it's better to go with **create-react-app + craco**. Yes, Next.js also has support for Module Federation, as far as I know, there's a paid plugin for it, but why use Next.js for lightweight micro-frontends? Micro-frontends are always about customization and flexibility, while Next.js is more of a monolithic framework. Additionally, [rspack](https://www.rspack.dev/) looks promising, theoretically allowing migration from webpack when Module Federation is ready there. 🏗️

### Next.js? 🌐

![Next.js](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/sywfnj3i60idpktqkx4o.png)

**Next.js** is an excellent framework. I always want to start a project with it because it's at the forefront of the React.js ecosystem, and it's satisfying to stay up-to-date. I've identified a few cases where I would choose Next.js for my projects:

1. SEO. 📈
2. Small backend 🌐

If your site is a sales page, a portfolio page, or something similar where SEO is crucial, then choosing Next.js seems justified. Also, if your backend isn't too complex, and you don't need a lot of server-side logic, which is generally suitable for portfolio sites, then Next.js can be a good choice. In other cases, I would consider different options.

For me, at this moment, the server in Next.js is a backend for frontend developers. In other words, it's suitable for something simple, but if you have complex business logic, you'll reach a point where you need a separate backend, and then all the advantages of Next.js will disappear. Especially when nowadays everyone goes to serverless backend on lambda functions. 🦄

### Vite + React.js? 🚀

![Vite](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ua9pomijmoef1pdoigup.png)

**Vite + React.js** is currently a good compromise for starting a new project. The community around Vite continues to grow, and most likely, all the typical problems you'll face during development have already been solved. You can enjoy fast builds and hot reload. The only drawback at the moment is Module Federation, as I mentioned in the create-react-app section. 🚀

## State Management 🧠

It's worth mentioning that state management needs to be divided into two parts: Server state management and Client state management. In my current applications, I separate these two concepts and use different tools for them.

![State management](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xf2g6gz2xvbo4yeqc3dy.png)

### Server state management

When choosing a tool for Server state management, you need to consider what you're using on the backend. For GraphQL, Apollo is suitable, and for REST API, there are several options:

- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) 🚀
- [SWR](https://swr.vercel.app/) 🕸️
- [react-query](https://tanstack.com/query/latest/) ⚛️

The react-query website even has a [comparison table](https://tanstack.com/query/v4/docs/react/comparison) of these tools.

![Comparison Table](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/il3tnf1mowjv1i3a5paz.png)

In my projects, I've long abandoned Redux, so I'm not inclined to choose **RTK-query**. Right now, I would choose **react-query** for my project because it offers more features than SWR. I make this choice to avoid risks in the future since this layer of the application is usually challenging to change during development. 🧐

### Client state management

For client state management, you need to choose the most suitable tool for the specific situation. Just think about how many questions regarding state management **react-query** has already answered for you. Data loading, loading states, and more are already handled. This means you only need to handle interactivity and UI element behavior, which are not usually very complex in most applications. Native React.js solutions will work in most places. However, if you need to solve more complex tasks, like a code editor with many states and actions, you'll need to choose a tool that helps manage those states. Here's a list of tools I would consider:

- [Zustand](https://zustand-demo.pmnd.rs/) 🏗️
- [Jotai](https://jotai.org/) 🧙‍♂️
- [Recoil](https://recoiljs.org/) 🌀

Since my requirements for client state management are not very complex, I would choose **Zustand**. It has a simple API and is suitable for most of my tasks. However, there's no problem using different approaches in different parts of the application. For example, using Zustand in one part and even [MobX](https://mobx.js.org/README.html) in another. 🔄

## UI Components 🎨

When choosing a library for working with UI components, you should always start with design layouts and requirements. If you have a design, choose a library that allows you to implement it. If you don't have a design, select a library that lets you create UI components quickly and customize them easily later. Here's a list of libraries I would consider:

- [Material UI](https://mui.com/) 📦
- [Chakra UI](https://chakra-ui.com/) 🌈
- [Ant Design](https://ant.design/) 🐜
- [Tailwind UI](https://tailwindui.com/) 🌟

Ant Design has almost everything you need, but it can be challenging to customize at times. Plus, it comes with tools for form handling and validation, so you don't have to think about that separately. That's why I often choose it. Of course, there's another option: creating your own component library. But I don't think any of your clients can afford that.

It's also crucial to document your component library using [Storybook](https://storybook.js.org/). It doesn't take much time, but it will be incredibly helpful for you and your team in the future. 📚

## Styling Approach 🎩

Customizing your UI components depends a lot on the component library you choose. In the case of Material UI, you'll have to live with their CSS in JS approach, which I'm not entirely fond of. Because in some cases, you'll need to use components from other libraries, and then you'll have to mix different styling approaches. It looks terrible in a project! Therefore, I would choose a library that allows the use of CSS modules, such as Chakra UI or Ant Design. This way, you'll achieve a consistent styling approach throughout the project.

### TailwindCSS?

![TailwindCSS](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/28f3mklepdunt6jhtwox.png)

I personally like Tailwind, and if I had to create my component library, I would definitely choose it because it's convenient. But, as I mentioned earlier, having consistency in my project is essential to me, and I can't afford to write some things in CSS Modules and others directly in markup. So, I wouldn't choose it for my project. Still, I can say with confidence that it's a good tool, and if you're not afraid of experiments, you can try it in your project. 🛠️

## Conclusion 🎉

Starting a React project involves key considerations:

- **Requirements:** Gather comprehensive project details, from browser support to design assets.

- **Common Components:** Include authentication, routing, state management, UI elements, internationalization, styling, and code quality tools.

- **Frameworks:** Choose wisely based on team expertise and project requirements. Experimentation is best suited for personal projects.

- **State Management:** Divide state management into server-side and client-side. Tools like Apollo, RTK Query, SWR, and react-query can be invaluable.

- **UI Components:** Select libraries like Material UI, Chakra UI, Ant Design, or Tailwind UI based on design needs.

- **Styling:** Prioritize consistent styling. Consider tools like Chakra UI or Ant Design with CSS modules for uniformity.

In summary, make informed choices aligned with project goals. Document decisions, and stay adaptable to evolving project needs. 🚀
