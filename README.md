# Fork of Buttplug Tampermonkey Scripts and Utilities

If you somehow managed to end up in this end of the internet, then I'm happy to tell you that I managed to load the latest buttplug with tampermonkey.
But for it to work you have to disable a browser security function with a chrome plugin, that prevents the buttplug script to load the wasm using fetch:
https://chrome.google.com/webstore/detail/always-disable-content-se/ffelghdomoehpceihalcnbmnodohkibj

If you have done that you can install the tampermonkey script:

[Chaturbate Vibrate On Tip](https://github.com/jabiim/buttplug-tampermonkey/raw/master/scripts/chaturbate-tips-buttplug.user.js)

This script does not use the utils anymore, but it has way less of a UI. 
(But I think the original did not use it either.)

Basically 2 button, `Click to connect device` and `Clear queue, stop device`.

There is 4 thing that is different form the original:
- it works with the current split view chat window
- it can handle multiple toys
- it is no longer goes at full power all the time (it is amount dependent as well)
  - 200 token or higher is 100%, it will go at least 5% after that it is linearly increasing based on the token amount
  - configurable check the code 
- it queues the tips, so you will feel every token not just changing to the last ones

If you want to customize thing open the script and start editing it after you installed it.

There is a relatively easy way to set up levels same as the models, you will find it around the 60th line or so.

## Original content

This repo houses scripts and utilties for using
[buttplug-js](https://github.com/buttplugio/buttplug-js) (the
javascript implementation of the [Buttplug Intimate Hardware Control
Protocol](https://buttplug.io)) with the [Tampermonkey user script
plugin](https://www.tampermonkey.net/). It contains both site specific
scripts, as well as utilities for adding device enumeration and
selection UI to new scripts.

## Installable Scripts

- [Chaturbate Vibrate On
  Tip](https://github.com/buttplugio/buttplug-tampermonkey/raw/master/scripts/chaturbate-tips-buttplug.user.js) -
  Causes local vibrating toys to vibrate on tip notifications in Chaturbate
  chats. Toys vibrate for 0.1s per token (So 10 tokens vibrates for
  1s, 100 tokens for 10s, etc...)

## Using Buttplug UI in new scripts

This repo also contains a simple UI that can be injected into sites
using tampermonkey. To add the UI to your script, add the following
@require lines:

```
// @require https://cdn.jsdelivr.net/npm/buttplug@0.12.2/dist/web/buttplug.min.js
// @require https://raw.githubusercontent.com/buttplugio/buttplug-tampermonkey/master/utils/buttplug-tampermonkey-ui.js
```

Things to note:
- The version of buttplug may change. Check the latest version of
  buttplug-js at [the
  repo](https://github.com/buttplugio/buttplug-js). You can also use
  "buttplug@latest", but note that it may break in the future
  depending on what has been added/changed.
- It may be good to pin the version of the tampermonkey-ui file to a
  tag instead of to the master branch, to avoid breakage in the future. This
  would mean using something like

```
// @require https://raw.githubusercontent.com/buttplugio/buttplug-tampermonkey/v1/utils/buttplug-tampermonkey-ui.js
```
