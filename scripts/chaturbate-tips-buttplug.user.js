// ==UserScript==
// @name Chaturbate Tips to Buttplug.io
// @description Uses buttplug-js to cause local sex toys to work when a tip appears in a chaturbate chat
// @author buttplugio
// @version 0.6
// @homepage https://buttplugio.github.io/buttplug-tampermonkey
// @updateurl https://github.com/buttplugio/buttplug-tampermonkey/raw/master/scripts/chaturbate-tips-buttplug.user.js
// @downloadurl https://github.com/buttplugio/buttplug-tampermonkey/raw/master/scripts/chaturbate-tips-buttplug.user.js
// @include http*://chaturbate.com/*/
// @include http*://*.chaturbate.com/*/
// @include http*://cb.dev/*/
// @include http*://*.cb.dev/*/
// @exclude http*://chaturbate.com
// @exclude http*://serve.ads.chaturbate.com/*
// @exclude http*://support.chaturbate.com/*
// @exclude http*://*.*/tipping/*
// @exclude http*://*.*/my_collection/*
// @exclude http*://*.*/tags/*
// @exclude http*://*.*/tag/*
// @exclude http*://*.*/*-cams/*
// @exclude http*://*.*/supporter/*
// @exclude http*://*.*/tipping/*
// @exclude http*://*.*/terms/*
// @exclude http*://*.*/sitemap/*
// @exclude http*://*.*/jobs/*
// @exclude http*://*.*/affiliates/*
// @exclude http*://*.*/contest/*
// @exclude http*://*.*/apps/*
// @exclude http*://*.*/security/*
// @exclude http*://*.*/billingsupport/*
// @exclude http*://*.*/law_enforcement/*
// @exclude http*://*.*/privacy/*
// @exclude http*://*.*/2257/*
// @exclude http*://*.*/photo_videos/*
// @grant GM_addElement
// @grant unsafeWindow
// @copyright MIT
// ==/UserScript==

// Chaturbate forces script to fetch only from a set of certain sites that does not contain any of the cdns
// So you will have to disable this protection of your browser
// https://chrome.google.com/webstore/detail/always-disable-content-se/ffelghdomoehpceihalcnbmnodohkibj

// Rather than using @require we do this,
// this ensures that the last script in the doc will be loaded from the cdn
// so when the `buttplug.min.js` tries to load the res of the code / wasm there won't be an issue
GM_addElement(document.body, 'script', {
  src: 'https://cdn.jsdelivr.net/npm/buttplug@1.0.17/dist/web/buttplug.min.js',
  type: 'text/javascript'
});

window.addEventListener('load', async function() {
  // if false
  //   strength will be tip amount/rate (200 by default)
  //     min 5%, max 100%
  //   time will be tip amount / timeRate sec (10 by default)
  //     no min / max
  // if true
  //   it will use the levels table
  let levelsSet = false;
  // set this if levelsSet is false
  const rate = 200;
  // set this if levelsSet is false
  const minPower = 5;
  // set this if levelsSet is false
  const maxPower = 100;
  // set this if levelsSet is false
  const timeRate = 10;
  // minToken - the lowest amount of token that trigger that level
  // time - vibration length in seconds
  // strength the power of the vibration %
  const levels = [
    {
      minToken: 1,
      time: 2,
      strength: 20
    },
    {
      minToken: 12,
      time: 6,
      strength: 40
    },
    {
      minToken: 31,
      time: 20,
      strength: 40
    },
    {
      minToken: 100,
      time: 40,
      strength: 70
    },
    {
      minToken: 225,
      time: 60,
      strength: 100
    },
    {
      minToken: 500,
      time: 60,
      strength: 100
    },
  ];
  try {
    // init bp
    await Buttplug.buttplugInit();
    // setup client
    let buttplugClient = new Buttplug.ButtplugClient("Tutorial Client");
    // holds the devices
    // add devices
    buttplugClient.addListener('deviceadded', async (device) => {
      console.log('Connected devices:');
      buttplugClient.Devices.forEach((device) => {
        console.log('  - '+device.Name);
      });
      handleQueue();
    });
    buttplugClient.addListener('deviceremoved', async (device) => {
      console.log('Connected devices:');
      buttplugClient.Devices.forEach((device) => {
        console.log('  - '+device.Name);
      });
    });

    // use the embeded connector
    const connector = new Buttplug.ButtplugEmbeddedConnectorOptions();
    await buttplugClient.connect(connector);

    let button = document.createElement("button");
    button.innerHTML = "Click to connect device";
    button.addEventListener('click', async () => {
      await buttplugClient.startScanning();
    });
    document.getElementById("header").appendChild(button);

    let button2 = document.createElement("button");
    button2.innerHTML = "Clear queue, stop device";
    button2.addEventListener('click', async () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      queue.length = 0;
      if (buttplugClient.Devices && buttplugClient.Devices.length) {
        buttplugClient.Devices.forEach((device) =>{
          device.vibrate(0);
        });
      }
    });
    document.getElementById("header").appendChild(button2);

    const queue = [];
    let lastMessage = null;
    let timer = null;

    let chatbox = document.querySelector('.message-list');

    // new message in the chat
    chatbox.addEventListener('DOMNodeInserted', async function (event) {
      const el = event.target;

      if (lastMessage !== el && el.className.includes('msg-text') && el.querySelector('span.emoticonImage') && el.innerHTML.match(/tipped \d+ token(s)?/)) {
        const amount = parseInt(el.innerHTML.match(/tipped (\d+) token(s)?/)[1]);
        const newTip = {
          amount: amount,
          strength: levelsSet ?
              levels.reduce((acc, level) => amount >= level.minToken ? level.strength : acc, 0) :
              Math.min(Math.max(amount / rate * 100, minPower), maxPower),
          time: levelsSet ?
              levels.reduce((acc, level) => amount >= level.minToken ? level.time : acc, 0):
              amount / timeRate,
        };
        addTipToQueue(newTip);
        lastMessage = el;
      }
    });

    async function handleQueue() {
      console.log('queue', JSON.parse(JSON.stringify(queue)));
      if (buttplugClient.Devices && buttplugClient.Devices.length > 0) {
        const tip = queue.shift();
        console.log('tip', tip);
        if (tip) {
          const strength = tip.strength;
          const time = tip.time;

          buttplugClient.Devices.forEach((device) =>{
            device.vibrate(strength/100);
          });

          console.log('running for ' + time + ' sec, strength:' + strength);
          timer = setTimeout(
              () => handleQueue(),
              time*1000
          );
        } else {
          timer = null;
          buttplugClient.Devices.forEach((device) =>{
            device.vibrate(0);
          });
        }
      }
    }

    function addTipToQueue(newTip) {
      queue.push(newTip);
      if (!timer) {
        handleQueue();
      }
    }
  } catch (e) {
    console.log(e);
  }
}, false);
