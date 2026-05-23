---
key: 1350
title: NAIS Notes
slug: NAIS_Notes
type: musing
date: "2007-12-14 00:00:00"
created: "2007-12-14 00:00:00"
modified: null
location: Seattle, WA
hidden: false
no_front: false
locked: false
width: null
height: null
tags: [Programming, sewcrates.com]
---

<p class="normal">My NAIS development work has been going relatively smoothly. I managed to converge on a decent database structure, and convert all my text posts and cast of horribles doodles into this structure. I even managed to write code that displays individual posts (text, photos, and cast of horribles), the home page, and posts based on tags. I began fiddling around with a new format for the posts, trying to create a cleaner look. I settled on the <a href=" http://en.wikipedia.org/wiki/Calibri" title="Calibri font">Calibri font</a> from Windows Vista, with a fallback to Verdana and Arial. The posts themselves are simpler, stealing a few ideas from <a href="http://kottke.org" title="Kottke ">Kottke </a>.</p><p class="normal">I originally used PHP 5’s new object-oriented (OO) structure, which provides much more OO power than PHP 4. That’s where I ran into problems. Most of the original sewcrates.com code was written using functional code. I used OO for some of the more complicated structures—such as the parser that indexed all the directories to generate my musing collection, and the code around the generation of photos. I saw NAIS as an opportunity to rewrite everything using an OO model.</p><p class="normal">It’s been a while since I effectively used OO design. (A “while” is a bit of an understatement. The last time I effectively used OO design was in graduate school before the millennium.) For the most part, I use objects as advanced structures to provide common global variables for functions to share. For NAIS I wanted to develop a more meaningful OO design, and I dived in before fully planning the approach. I ended up with a strange design that left me struggling.</p><p class="normal">As I looked through my code files, I noticed that I created too many objects, overusing inheritance (not multiple inheritance, which is not available, thankfully). I’ve since gone back and removed most of the OO use. OO is very useful in some areas, but it tends to be overused, especially by me. In replacing the classes with functions, I did find a bunch of places where I could have used the class to limit how many variables I pass in related functions. There is an advantage to passing variables, however. I can control (and more importantly understand) what parameters the functions are using.</p>
