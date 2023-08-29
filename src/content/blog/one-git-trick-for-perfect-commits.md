---
author: Raman Nikitsenka
pubDatetime: 2023-08-15T15:04:04Z
title: 🚀 One Git Trick for Perfect Commits 🛠️
postSlug: one-git-trick-for-perfect-commits
featured: true
draft: false
tags:
  - git
  - productivity
ogImage: ""
description: "Git fixup is a simple technique that will help you keep your commit history clean and organized."
---

Are you tired of seeing vague and meaningless commit messages like:

```shell
fix: close pull request discussion
fix: fix review discussion
```

If you're nodding your head in agreement, it might be time to introduce the "git fixup" technique to your team's workflow, or even just adopt it for yourself.

If the concept seems complicated and overwhelming, don't worry – you're about to be pleasantly surprised. Git fixup is actually quite simple, especially if you're already comfortable with making commits. Let's jump right in! 🏊‍♂️

Imagine you've made several commits on your working branch and have submitted a merge or pull request. However, during the code review, issues were identified—whether by your peers or during your own self-review. Instead of creating separate commits to address these problems, you can simply use the git fixup command. Here's how:

1. Identify the hash of the commit where the problem was found.
2. Run the command💡:

```shell
git commit --fixup=<commit hash you want to fix>
```

This command will generate a new commit with the original commit's subject, prefixed with `fixup!`. This additional commit might seem like a slight inconvenience, but even it is already far better than having vague commit messages cluttering your history.

But we're not done yet. The next step is to incorporate the fixup commit into the original commit using the following command:

```shell
git rebase --autosquash -i main
```

Here's what these parameters mean:

- `-i`: Interactive mode for the rebase.
- `--autosquash`: A special flag that squashes fixup commits into their respective originals.
- `main`: The branch from which your current branch originated.

**!!! This is a rebasing command, and you should be aware that this command will change your Git History. So, do it only if you know how it works.**

After executing this command, a text editor (VIM by default) will appear. Don't worry—there's no need to make changes. Simply close it by typing `:q!`.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ft8a25h0ubg276l1xort.png)

Congratulations! Your commit history is now clean and organized. You're ready to share your changes with your team. Just use either of these commands to push your changes, depending on your circumstances:

- if you work on the branch alone: `git push --force` 💪
- if you share the branch with someone: `git push --force-with-lease` 🤝

To summarize:

1. Copy the hash of the commit you want to fix.
2. Run `git commit --fixup=<commit hash>`.
3. Execute `git rebase --autosquash -i main`.
4. Check the open text editor and close it if everything looks good (`:q!`).
5. Use `git push --force` to publish your changes.
