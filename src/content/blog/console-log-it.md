---
author: Raman Nikitsenka
pubDatetime: 2023-09-18T18:53:01Z
title: "Console.log it"
postSlug: console-log-it
featured: false
draft: false
tags:
  - productivity
  - programming
  - beginners
ogImage: ""
description: "Finding and fixing bugs in your program is a common task for every developer. In this article, I will outline the steps I follow in my daily work to identify and resolve these issues."
---

Finding and fixing bugs in your program is a common task for every developer. In this article, I will outline the steps I follow in my daily work to identify and resolve these issues.

Let's assume that this bug has already been prioritized for you, and you don't need to validate its value for your project.

And remember _Catching A Pokémon Is Not About Skill._

![Detective Pikachu](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/v2je5bhustbi9tctn3c2.png)

## Visual Detection

**Prove Bug Reproduction**: Gather all facts about the bug, including when and how it reproduces. Ensure that the bug is reproducible. It's important to consider that what may seem like a bug could also be a lack of requirements. You might need to implement a new feature to address it. So, before rushing into fixing it, check if it conflicts with the requirements.

Reproducing the bug can sometimes be a non-trivial task. Bugs can occur in various places, including:

- Your code
- Server environment (servers)
- Network problems
- Client environment (browsers, applications, OS)

## History

Once you have confirmed that the bug exists, the next step is to determine when it started to occur. You can either blame the file where the bug is appearing or examine the Git history and files that were changed, which can provide insights into the problem.

I personally use VSCode along with the GitLens extension. It makes it easy to blame a file line by line and it offers a Commit Graph feature to navigate through your Git history and view changed files.

Remember that **not only the code** can be the cause of the bug. Be aware of recent changes in updates of your server environment.

## Google it

Consider searching for solutions online. You can use Google, stack overflow, or even ask questions to AI models like ChatGPT, which sometimes are not quite well for it, so I stopped doing it, but maybe for getting a new idea when you stacked it can be good.

## Bottom-Up Approach

When dealing with bugs, consider using `console.log` or debugging with built-in tools from where the error occurred and work your way up through the reference tree. This helps you understand the code flow and identify issues.

Note that debugging may not work well for certain scenarios, such as mouse move events, or when you need to track the difference of values between renders. So `console.log` can be here only one option.

Sometimes the bug can occur without throwing any errors. It can be some inconsistent behavior on UI, so try to search by word, or component name for checking the problem. I even had in my projects CSS debug rule like:

```css
.debug {
  outline: 1px solid red;
}
```

It helped with the visual detection of a component where the bug is occurred.

## Binary Search

For localizing and isolating the bug, employ a method similar to a binary search used in engineering. This approach helps narrow down the potential sources of the problem.

Remove dependencies from your code, and check the results, if the bug is still reproduced repeat it again.

## Open-Source Contributions

If the bug is not within your codebase, consider opening an issue in the relevant open-source repository and consider making a pull request to resolve it.

## Ask your teammate

You can stuck with your investigation sometimes, and if you already have done all of the previous steps, go for advice from one of your teammates. Tell him/her about your investigation, what you've already done step by step, what you've found, show some tricky points that you don't quite understand, and ask his/her opinion and ideas about it. Most of the time during your explanation you can find a solution yourself, or you will try to prove the hypotheses of your teammate. If you are not lucky try another teammate and so on.

## Add tests

Having tests in your code is the most important thing on the way do not repeat the same bug in the future. I cannot advise using **TDD** methodology from the start of your project, but when you are fixing the bug, it is great to use it. Write your test to prove the bug, and then make it green. Writing unit tests for some startups in my opinion doesn't give significant results, and sometimes it is difficult to sell this idea to a business. Instead, consider using e2e testing libraries like Playwright, Cypress, and so on, they give you results immediately, and you will never again repeat this bug.

## Communication with Managers

Stay in constant communication with your project managers. They are not interested in wasting time, so keep them updated on your progress, share the results, and set reasonable deadlines. Let them make a decision to continue your investigation. If necessary, discuss the possibility of implementing Plan B. Sometimes, reworking a specific part of the product might be more cost-effective than fixing a complex bug.

## Conclusion

I really like finding bugs in the code, especially when you eventually solve them. So here is the short plan for you to fix any bug in your code:

1. Reproduce the bug (it is not always the codebase)
2. Gather all available information about the history of the bug
3. Google by error
4. Console.log from bottom to up
   - Binary search
   - Time to contribution to open-source
   - Ask your team mate (explain it)
5. Add tests to cover the bug
6. Always be in touch with your managers
