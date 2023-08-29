import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://0ro.github.io/",
  author: "Raman Nikitsenka",
  desc: "Software Engineer, Frontend Developer, Tech Lead",
  title: "Raman Nikitsenka",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 5,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/261b1319a",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Github",
    href: "https://github.com/0ro",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/watchclock123",
    linkTitle: `${SITE.title} on Twitter`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:raman.nikitsenka@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
];
