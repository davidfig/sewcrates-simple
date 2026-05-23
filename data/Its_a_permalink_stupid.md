---
key: 1347
title: It’s a permalink, stupid
slug: Its_a_permalink_stupid
type: musing
date: "2007-12-03 06:14:32"
created: "2007-12-03 06:14:32"
modified: null
location: Seattle, WA
hidden: false
no_front: false
locked: false
width: null
height: null
tags: [Programming, sewcrates.com]
---

<p class="normal"><span class="bold"><span class="underline">Update</span>: I'm not sure if what I write below is true. There are obviously issues with sewcrates and search robots, but I'm not certain I found the culprit. (The fact that I'm stupid is not at issue.)</span></p><p class="normal">Okay, so I’m an idiot. This is what happens when you write your own blogging software. You miss things. I was interested to see what would happen when I started posting programming/technical advice. A few days later, I received a referral from Google for my <a href="http://sewcrates.com/Archive/2007-11-27-16:02:40/" title="Internet Sharing on the Q9 post">Internet Sharing on the Q9 post</a>. Excellent, I think. My name is out there. I’m in Google. I received a visitor.</p><p class="normal">I then checked the referral results, and noticed that Google does not link to the article, but to the front page. That can’t be right. If it links to the front page, then it will be gone in a few days, and when people visit, they won’t see the post unless they checked the Google cache.</p><p class="normal">It took me a few short searches on “Permalink” to realize my mistake: I never added the <span class="italics">rel="bookmark"</span> to my permalink (<a href="http://annevankesteren.nl/2003/08/putting-relbookmark-to-work" title="best source">best source</a> and <a href="http://en.wikipedia.org/wiki/Permalink" title="Wikipedia: Permalink">Wikipedia: Permalink</a>). Here I was, running around without real permalinks. I even titled the links “link back,” thinking those magical words would mean something to the search robots. (They don’t, of course.)</p><p class="normal">A few coding changes and I added the <span class="italics">rel="bookmark"</span> code to all of my permalinks on sewcrates and castofhorribles. If I wasn’t so stubborn, I would fall into the welcoming embrace of MoveableType or Wordpress. Thankfully, I’m terribly inflexible when it comes to programming.</p>
