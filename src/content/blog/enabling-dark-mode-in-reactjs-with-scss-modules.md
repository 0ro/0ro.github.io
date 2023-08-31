---
author: Raman Nikitsenka
pubDatetime: 2023-08-29T09:38:04Z
title: "Enabling Dark Mode in React.js with SCSS Modules 🌙"
postSlug: enabling-dark-mode-in-reactjs-with-scss-modules
featured: false
draft: false
tags:
  - react
  - scss
  - css
ogImage: ""
description: "In one of my recent projects, I needed to add support for dark mode to a React.js Single Page Application (SPA). Since we were using SCSS modules to style our elements, let's explore how to implement dark mode in a React.js project with SCSS modules."
---

In one of my recent projects, I needed to add support for dark mode to a React.js Single Page Application (SPA). Since we were using SCSS modules to style our elements, let's explore how to implement dark mode in a React.js project with SCSS modules.

## Switching Color Schemes

With widespread browser support for [CSS variables](https://caniuse.com/css-variables), I don't see any alternative to using the **body class + CSS variables** approach. This means that when a user enables dark mode in your application, a `.dark` class is added to the `body` tag, and the variables are overridden based on the presence or absence of this class.

## CSS Variables

If you're not already familiar, **CSS variables (custom properties)** are entities in CSS that allow you to store values and then use them in your styles. For example:

```scss
body {
  --text-color: #ccc; // define a CSS variable
}

h1 {
  color: var(--text-color); // get a variable
}

p {
  color: var(--text-color); // get a variable
}
```

Variable names should always start with a double hyphen (--), and you access a variable by using the **var()** function.

The **var()** function will attempt to find the **--text-color** variable within its scope or from its parents. In our case, that's the body. However, you can redefine this variable so that, for example, **h1** and **p** elements inside sections have a different color:

```scss
section {
  --text-color: #ddd;
}
```

In our case, this trick will help override variables for dark mode.

## Real case

First, declare all the variables your designers use in layouts on the **:roo**t pseudo-class and add them to a **global.scss** file in your project:

```scss
:root {
  --black: #000;
  --gray: #ccc;
  --white: #fff;
  --blue: #0085f2;
}
```

In this case, I suggest not tying variable names to the entities where you plan to use them. For instance, don't name them like **--text-primary-color: #ccc**, because we're going to define this at the level of React component styles. For example, you have a <Text/> component:

```tsx
import classNames from "classnames";

import styles from "./Text.module.scss";

interface ITextProps {
  type?: "primary" | "secondary";
  children?: React.ReactNode;
}

export const Text: React.FC<ITextProps> = ({
  type = "primary",
  children,
}) => {
  return (
    <p className={classNames(styles.root, styles[`${type}Type`])}>
      {children}
    </p>
  );
};
```

As you can see, this is a simple React Component that can have one of two types, which we intend to handle in the style file.

The style file (Text.module.scss) for this component will look like this:

```scss
.primaryType {
  --text-color: var(--blue);

  color: var(--text-color);
}

.secondaryType {
  --text-color: var(--black);

  color: var(--text-color);
}
```

Here, for each text type, I've defined my own variable whose value is taken from the **:root** pseudo-class.

Now, to enable dark mode for text, we need to use the **body.dark** class. We can do this as follows:

```scss
.primaryType {
  --text-color: var(--blue);

  color: var(--text-color);
}

.secondaryType {
  --text-color: var(--black);

  color: var(--text-color);
}

:global(.dark) {
  .primaryType {
    --text-color: var(--gray);
  }

  .secondaryType {
    --text-color: var(--white);
  }
}
```

**:global(.dark)** allows us to use global SCSS modules classes. Here, we simply override variable values, which, due to the nesting within the **.dark** class, will take higher priority than the ones declared above.

Since we are using SCSS, we can create a **mixin** based on this approach. Let's also add a media query to apply dark mode based on the user's operating system settings.

![Mac OS theme change](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/xcrx5cnu3qsq2j1pxml6.png)

Here's what the mixin will look like:

## SCSS Mixin

```scss
@mixin dark-mode {
  @media (prefers-color-scheme: dark) {
    @content;
  }

  :global(.dark) {
    @content;
  }
}
```

And here's how you can use this mixin:

```scss
@import "../styles/mixins";

.primaryType {
  --text-color: var(--blue);

  color: var(--text-color);
}

.secondaryType {
  --text-color: var(--black);

  color: var(--text-color);
}

@include dark-mode {
  .primaryType {
    --text-color: var(--gray);
  }

  .secondaryType {
    --text-color: var(--white);
  }
}
```

This way, dark mode styles for your components will be isolated and conveniently located at the end of the file, making it easy to navigate through them. 🌙
