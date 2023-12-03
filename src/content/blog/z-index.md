---
author: Raman Nikitsenka
pubDatetime: 2023-12-03T15:39:02Z
title: "z-index trick you might not know"
postSlug: z-index-trick-you-might-not-know
featured: false
draft: false
tags:
  - html
  - css
ogImage: ""
description: "In one of the projects where I recently worked, we had a pretty trivial task: Add a panel of buttons for our canvas editor."
---

In one of the projects where I recently worked, we had a pretty trivial task: Add a panel of buttons for our canvas editor. The design in Figma for this panel looked like this:

![Figma design](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/1mn7ci2oc60etgqm7puj.png)

As you can see, there is a canvas in the design, and above it, a panel with buttons:

1. The buttons need to have the same gap between each other.
2. And you should be able to draw behind the buttons.

## How to achieve it?

```html
<button>Button</button>
<button>Button</button>
<button>Button</button>
<canvas id="canvas" />
```

So **the first option** that will satisfy our requirements is to create all buttons, add them position absolute property, then do some math and add `left` and `top` properties to every button. That's crazy, right? Especially if you have dynamic content inside of your buttons.

## What is another approach?

```html
<div class="panel">
  <button>Button</button>
  <button>Button</button>
  <button>Button</button>
</div>
<canvas id="canvas" />
```

Let's see the problem from another perspective and try to redefine our task. To make a panel with buttons and make them respect each other, it's better to wrap them in a container. With flex or grid properties, we will have a desirable behavior for its children. Then we need to calculate the position for that container. You can see the result in the next image:

![Panel above canvas](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5gx0o9uu2ul0e4809w0q.png)

But what about our second requirement? We already can't draw in space between buttons. Even if we make our wrapper totally transparent, the click will be caught by this panel, and the canvas will not see it.

Ideally, we need to have something like this:

![Canvas between panel and buttons](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6bus9xiczrbgtyj5m782.png)

Is it even possible? To somehow sneak between your sibling (panel) and its children (buttons) and achieve that rendering order?

Yes, it is. And I'll tell you how.

## A bit of theory

Let's say we set a position absolute property to our panel element in CSS. What do you think will happen with its rendering order on the page?

According to [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_without_z-index):

> When the z-index property is not specified on any element, elements are stacked in the following order (from bottom to top):
>
> - The background and borders of the root element.
> - Descendant non-positioned elements, in order of appearance in the HTML.
> - Descendant positioned elements, in order of appearance in the HTML.

So, because our panel is already a positioned element, it will be on the top of our canvas. If we set `position: absolute` to the canvas, then the canvas will be on the top because it appears after the panel element in HTML.

But what if we set z-index: 1 to our buttons? Logically, it seems that they should start counting their index from their parent (panel) and still be under the canvas, but they will be **on top of the canvas!!!**, and our initial task is done.

You can check it here in this [interactive example](https://codesandbox.io/p/sandbox/vigilant-cdn-2qgwqf?file=%2Fstyles.css%3A16%2C22&layout=%257B%2522sidebarPanel%2522%253A%2522EXPLORER%2522%252C%2522rootPanelGroup%2522%253A%257B%2522direction%2522%253A%2522horizontal%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522id%2522%253A%2522ROOT_LAYOUT%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522UNKNOWN%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522clpphmk8500063b6l34zn6acq%2522%252C%2522sizes%2522%253A%255B100%252C0%255D%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522EDITOR%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522EDITOR%2522%252C%2522id%2522%253A%2522clpphmk8500023b6lijmanpsz%2522%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522direction%2522%253A%2522horizontal%2522%252C%2522id%2522%253A%2522SHELLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522SHELLS%2522%252C%2522id%2522%253A%2522clpphmk8500033b6l4700sfc4%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%257D%252C%257B%2522type%2522%253A%2522PANEL_GROUP%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522direction%2522%253A%2522vertical%2522%252C%2522id%2522%253A%2522DEVTOOLS%2522%252C%2522panels%2522%253A%255B%257B%2522type%2522%253A%2522PANEL%2522%252C%2522contentType%2522%253A%2522DEVTOOLS%2522%252C%2522id%2522%253A%2522clpphmk8500053b6l418o6o15%2522%257D%255D%252C%2522sizes%2522%253A%255B100%255D%257D%255D%252C%2522sizes%2522%253A%255B45.1651840700698%252C54.8348159299302%255D%257D%252C%2522tabbedPanels%2522%253A%257B%2522clpphmk8500023b6lijmanpsz%2522%253A%257B%2522id%2522%253A%2522clpphmk8500023b6lijmanpsz%2522%252C%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clpphpx5i00023b6rwnyotirw%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522FILE%2522%252C%2522initialSelections%2522%253A%255B%257B%2522startLineNumber%2522%253A16%252C%2522startColumn%2522%253A22%252C%2522endLineNumber%2522%253A16%252C%2522endColumn%2522%253A22%257D%255D%252C%2522filepath%2522%253A%2522%252Fstyles.css%2522%252C%2522state%2522%253A%2522IDLE%2522%257D%252C%257B%2522id%2522%253A%2522clppjb32f00023b6rzu6sx4jd%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522FILE%2522%252C%2522initialSelections%2522%253A%255B%257B%2522startLineNumber%2522%253A15%252C%2522startColumn%2522%253A7%252C%2522endLineNumber%2522%253A15%252C%2522endColumn%2522%253A7%257D%255D%252C%2522filepath%2522%253A%2522%252Findex.html%2522%252C%2522state%2522%253A%2522IDLE%2522%257D%252C%257B%2522id%2522%253A%2522clppjjw5j00023b6rb9d8zl1l%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522FILE%2522%252C%2522initialSelections%2522%253A%255B%257B%2522startLineNumber%2522%253A4%252C%2522startColumn%2522%253A22%252C%2522endLineNumber%2522%253A4%252C%2522endColumn%2522%253A22%257D%255D%252C%2522filepath%2522%253A%2522%252Findex.js%2522%252C%2522state%2522%253A%2522IDLE%2522%257D%255D%252C%2522activeTabId%2522%253A%2522clpphpx5i00023b6rwnyotirw%2522%257D%252C%2522clpphmk8500053b6l418o6o15%2522%253A%257B%2522tabs%2522%253A%255B%257B%2522id%2522%253A%2522clpphmk8500043b6lva20rxer%2522%252C%2522mode%2522%253A%2522permanent%2522%252C%2522type%2522%253A%2522UNASSIGNED_PORT%2522%252C%2522port%2522%253A0%252C%2522path%2522%253A%2522%2522%257D%255D%252C%2522id%2522%253A%2522clpphmk8500053b6l418o6o15%2522%252C%2522activeTabId%2522%253A%2522clpphmk8500043b6lva20rxer%2522%257D%252C%2522clpphmk8500033b6l4700sfc4%2522%253A%257B%2522tabs%2522%253A%255B%255D%252C%2522id%2522%253A%2522clpphmk8500033b6l4700sfc4%2522%257D%257D%252C%2522showDevtools%2522%253Atrue%252C%2522showShells%2522%253Afalse%252C%2522showSidebar%2522%253Atrue%252C%2522sidebarPanelSize%2522%253A15%257D)
But how does it work?

## Explanation

The trick is, if you don't set the `z-index` property to your position absolute element, this element doesn't create a stacking context. We didn't set `z-index` to panel and the ordering of render for our elements can be represented like this:

```
root element // 0
  panel // 1
    button // 2
    button // 3
    button // 4
  canvas // 5
```

The number at the line of the element is the order of rendering. The order is defined as preorder depth-first traversal of the rendering tree. Pre-order traversal means:

1. Traverse the root node
2. Traverse sub-trees from left to right

![Order tree](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ulr2mo7inz5x4tdo9v5p.png)

The more detailed information about ordering and stacking context, read in [CSS spec](https://www.w3.org/TR/CSS21/zindex.html)

## Conclusion 🚀

In conclusion, understanding the intricacies of z-index and how it interacts with the positioning of elements can lead to clever solutions, as demonstrated in my example. Remember that an element with `position: absolute` **without** `z-index` doesn't create a stacking context.
