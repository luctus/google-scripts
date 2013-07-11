gmail-scripts
=============

A compendium of google scripts that I've done for both improve my productivity and fun.

## Introduction 

### What is a Google Script?

A Google Script is a script that can be executed at Google's side and can invoke several libraries 
developed by Google, in order to interact with Gmail, Calendar, Drive, etc.

You can see a really good documentation here: https://developers.google.com/apps-script/reference/gmail/

### Where should I write my Google Script?

It's a little bit weird at the begining, you need to create a new SpreadSheet and the click on 
__Tools__ > __Script Editor__. There will be opened a new window with the editor. You can write a function there
and then run it with the _play_ button.

### Do I need to run this script manually?

Yes, you can run your script every time you want __or configure a Trigger__: Click on _Resources_ and then 
_All your triggers_. You can set a trigger like, for example: "Run my foobar function every 5 minutes".

### How could a script improve my productivity?

Let's see the first script: dont-forget-to-retry.js

## dont-forget-to-retry.js

- Let's say you contact people every day, asking for photos, projects, or what ever.
- Let's say every email you send contacting people has the _subject_ "Are you interested?"
- Let's say you can label every mail you send (creating a filter by _subject_ and adding the _label_ "GS-Request" automatically)
- Let's say some people replies you (great!) and another people don't.
- Let's say if you retry contacting some people that haven't replied yet you can get new replies (great!)

So, trigger this script every 1 hour (more or less) and every email labeled with "GS-Request" will be labeled with
"GS-RequestOK" (if the recipient replied you) or "GS-RequestPending" (if the recipient doesn't replied you yet) too.

Thus, you can see the _label_ "GS-RequestPending" and retry contacting that person. When someone replies you, 
the _label_ "GS-RequestPending" will be removed automatically the next time the script is triggered.

