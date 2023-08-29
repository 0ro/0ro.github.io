---
author: Raman Nikitsenka
pubDatetime: 2023-08-15T18:58:43Z
title: "🚀 VSCode + Vim: The Perfect Match for Coding Domination 💪"
postSlug: vscode-vim-the-perfect-match-for-coding-domination
featured: false
draft: false
tags:
  - vim
  - vscode
  - productivity
ogImage: ""
description: "This is my story of adopting Vim and how I grew to love it."
---

There are already many stories about Vim, detailing how it is useful for developers' lives. It makes screen sharing easier during the interview process or when pair programming at your current job, as familiarity with Vim makes you faster at coding. This enables you to quickly test all your ideas and select the best one. This is my story of adopting Vim and how I grew to love it.

##   First attempts 👶

When I began my journey as a programmer, I used to work in the Sublime Text editor—almost everyone at that time used it. And I was content. Only now do I realize how slow I was. However, back then, I wasn't very proficient in programming; I had just started. The pace of my thoughts matched the speed of my typing. So, everything was satisfactory for me—I had never been hindered by typing speed or my efficiency.

After several years of active programming, I switched to VSCode and began to realize that something was amiss with my efficiency—not due to VSCode itself, but due to how I worked and wrote my code. This was despite the fact that I had learned all the hotkeys that my teammates had never heard of. One day, I came across a video on YouTube showcasing a person performing editor magic. It seemed like he was a hacker character from those movies where they never touch a mouse and just type incredibly fast. It was at that moment I comprehended how slow my speed was and that I needed to make some changes. That experience provided me with motivation; I wanted to be like that guy.

So, I discovered that the best way to learn Vim is through vimtutor. I'm using macOS, and if you are too, you already have it on your computer. Simply run this command in your terminal:

```shell
> vimtutor
```

![vimtutor](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zv01kovx2kg13jf5mkbh.png)

It's a nice starting point if you want to give Vim a try. By the way, in lesson 1.2, they will explain how to exit from Vim, so you will not be lost. Don't worry.

I gave it a try as well, attempting to integrate it into my actual coding workflow, but I found myself uncertain about the next steps. It seemed that everyone in the Vim world had their own Vim configuration with plugins and customized settings. For me, this complexity felt like a challenge—it wasn't user-friendly, and I couldn't even locate the starting point for this journey. So, I abandoned it and returned to VSCode. Nevertheless, thoughts of Vim lingered. I tried it time and again, but without success, ultimately leading me to give up.

After several months of tormenting myself, feeling ineffective, I finally reached a compromise.

##  The compromise 🤝

![vim extension](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/9oivc7djd6a44c1kz57n.png)

The compromise came in the form of the Vim extension for VSCode. It seemed to offer the easiest way to integrate Vim into my real-life workflow; all I needed was familiarity with vimtutor. So, I installed it and began using it. Admittedly, my initial progress was slow—slower than my regular mouse movements and VSCode shortcuts. However, I was determined to improve. After two weeks of consistent effort, my speed surpassed what I had achieved without Vim.

Some Vim enthusiasts, who are deeply attached to the Vim editor, often contend that Vim plugins are inferior versions of Vim itself. These plugins are often restricted to the code area of your editor, whereas the original Vim gives you full control over various aspects, such as navigating through your file tree using Vim commands, among other things.

I discovered a way to bring this functionality to VSCode. If you're already familiar with VSCode's keybinding system, you know that you can map keys to specific VSCode actions. Now, armed with Vim knowledge, you can adapt this to your keybinding system. For instance, if you want to move between tabs in VSCode, you can press `alt+h` or `alt+l` since `h` and `l` correspond to left and right movements in Vim. Similarly, to focus on the explorer panel, `ctrl+h` can be pressed as it's located on the left side of your text editor, and so on.

To make adoption for you easier, I'm happy to share [my keybinding configuration](https://gist.github.com/0ro/ea0e44bdc3cb1a94ef03d8426ef32195) with you.

## Conclusion 🎉

To summarise, here's all you need to do, to bring VIM in your coding life now:

1.      Complete vimtutor.
2.      Install the Vim extension in VSCode.
3.      Edit your keybindings.json file (navigate to keyboard shortcuts in Settings, then switch to the JSON version).
