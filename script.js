let candles = 0;
let score = 0;
let retryCount = 0;
let cameFromNo = false;

const maxRetries = 3;

const retryMessages = [
  "Wanna play again since you really hate me?",
  "Still not done punching me?!",
  "Violence is not the answer... but okay 😂"
];



// Sound effects
const sounds = {
  letsgo: new Audio("letsgo.mp3"),
  yes: new Audio("yes.mp3"),
  no: new Audio("no.mp3"),
  confetti: new Audio("confetti.mp3")
};
sounds.ouch = new Audio("ouch.mp3");


document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', startSite, { once: true });

  document.querySelector('button[onclick="showPopup()"]')
    .addEventListener('click', () => playSound('letsgo'));

  document.querySelector('button[onclick="startGame(\'yes\')"]')
    .addEventListener('click', () => playSound('yes'));

  document.querySelector('button[onclick="startGame(\'no\')"]')
    .addEventListener('click', () => playSound('no'));
});

function playSound(key) {
  if (sounds[key]) {
    sounds[key].currentTime = 0;
    sounds[key].play();
  }
}

function startSite() {
  const welcome = document.getElementById('welcome');
  welcome.classList.remove('hidden');
  welcome.classList.add('fade-in');
  // ✅ Start music on first interaction
  const music = document.getElementById('bgMusic');
  music.volume = 0.5;
  music.play().catch(e => {
    console.log("Music play blocked by browser until user interacts");
  });
}

function showPopup() {
  const welcome = document.getElementById('welcome');
  const popup = document.getElementById('popup');

  welcome.classList.remove('fade-in');
  welcome.classList.add('fade-out');
  setTimeout(() => {
    welcome.classList.add('hidden');
    popup.classList.remove('hidden');
    popup.classList.add('fade-in');
  }, 500);
}

function startGame(choice) {
  document.getElementById('popup').classList.add('hidden');

  if (choice === 'no') {
    cameFromNo = true;
    document.getElementById('gameConfirm').classList.remove('hidden');
    document.getElementById('gameConfirm').classList.add('fade-in');
  } else {
    document.getElementById('mainMessage').classList.remove('hidden');
    startConfetti();
  }
}


function startGames() {
  document.getElementById('gameConfirm').classList.add('hidden');
  document.getElementById('cakeGame').classList.remove('hidden');
  setTimeout(() => document.getElementById('hint').classList.remove('hidden'), 5000);
}

function teaseHer() {
  const playYes = document.getElementById('playYes');
  playYes.classList.add('grow-button');
}

function startCakeGame() {
  document.getElementById('gameConfirm').classList.add('hidden');
  document.getElementById('cakeGame').classList.remove('hidden');
  setTimeout(() => document.getElementById('hint').classList.remove('hidden'), 5000);
}

function lightCandle() {
  candles++;
  if (candles >= 5) {
    document.getElementById('cakeGame').classList.add('hidden');
    document.getElementById('cakeTroll').classList.remove('hidden');
  }
}

function startWhack() {
  document.getElementById('retryPopup').classList.add('hidden');
  retryCount++; // Track full sessions played

  document.getElementById('cakeTroll').classList.add('hidden');
  document.getElementById('whackGame').classList.remove('hidden');
  score = 0;
  document.getElementById('score').textContent = score;

  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    const hole = document.createElement('div');
    hole.className = 'hole';
    grid.appendChild(hole);
  }

  const holes = document.querySelectorAll('.hole');
  const timerBar = document.getElementById('timerBar');
  timerBar.style.animation = 'shrink 15s linear forwards';

  let interval = setInterval(() => {
    holes.forEach(h => {
      h.innerHTML = '';
      h.onclick = null;
    });

    const index = Math.floor(Math.random() * holes.length);
    const boo = document.createElement('img');
    boo.src = 'face.png';
    boo.className = 'boo';

    holes[index].appendChild(boo);
    holes[index].onclick = () => {
      if (holes[index].contains(boo)) {
        score++;
        playSound('ouch');
        document.getElementById('score').textContent = score;

        const reaction = document.createElement('div');
        reaction.className = 'hit-reaction';
        reaction.innerText = 'Oh you really hate me!';
        reaction.style.top = `${Math.random() * 70 + 10}%`;
        reaction.style.left = `${Math.random() * 80 + 10}%`;
        document.body.appendChild(reaction);
        setTimeout(() => reaction.remove(), 1000);

        boo.remove();
        holes[index].onclick = null;

        if (score >= 5) {
        clearInterval(interval);
        timerBar.style.animationPlayState = 'paused';
        document.getElementById('whackGame').classList.add('hidden');

        retryCount++;

        const popup = document.getElementById('retryPopup');
        const text = popup.querySelector('p');
        const buttons = popup.querySelector('.buttons');

        if (retryCount < maxRetries) {
          // Random message each time
          const msg = retryMessages[Math.floor(Math.random() * retryMessages.length)];
          text.innerText = msg;

          buttons.innerHTML = `
            <button onclick="startWhack()">Play Again</button>
            <button onclick="continueToLove()">Okay fine 💗</button>
          `;
        } else {
          // Final attempt — only "Okay fine"
          text.innerText = "Alright alright, no more punching. Let's be cute now 😅";
          buttons.innerHTML = `
            <button onclick="continueToLove()">Okay fine 💗</button>
          `;
        }

        popup.classList.remove('hidden');
      }


      }
    };
  }, 900);

  setTimeout(() => {
    if (score < 5) {
      clearInterval(interval);
      timerBar.style.animationPlayState = 'paused';
      document.getElementById('whackGame').classList.add('hidden');

      const troll = document.createElement('div');
      troll.className = 'popup';
      troll.innerHTML = `
        <p>Haha suck it! You really love me!</p>
        <button onclick="document.getElementById('mainMessage').classList.remove('hidden'); this.parentElement.remove(); startConfetti();">Okay fine 💖</button>
      `;
      document.body.appendChild(troll);
    }
  }, 15000); // 15 seconds
}

function continueToLove() {
  document.getElementById('retryPopup').classList.add('hidden');

  if (cameFromNo) {
    document.getElementById('finalCelebrate').classList.remove('hidden');
  } else {
    document.getElementById('mainMessage').classList.remove('hidden');
    startConfetti();
  }
}

function revealFinalMessage() {
  document.getElementById('finalCelebrate').classList.add('hidden');
  document.getElementById('mainMessage').classList.remove('hidden');
  startConfetti();
}



function startConfetti() {
  playSound('confetti');
  const canvas = document.getElementById('confetti');
  const confetti = window.confetti.create(canvas, { resize: true, useWorker: true });

  const end = Date.now() + 3000; // Confetti duration (3 seconds)
  (function frame() {
    confetti({
      particleCount: 100,
      spread: 200,
      origin: { x: 0.5, y: 0.5 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame); // Continue animation until time runs out
    }
  })();
  startEggplants();
}

function startEggplants() {
  setInterval(() => {
    const egg = document.createElement('img');
    egg.src = 'eggplant.png';
    egg.className = 'eggplant';
    egg.style.top = `${Math.random() * 80 + 10}%`;
    egg.style.left = `${Math.random() * 90 + 5}%`;
    document.body.appendChild(egg);
    setTimeout(() => egg.remove(), 5000);
  }, 2000);
}

function showLoveCards() {
  document.getElementById('lovePopup').classList.add('hidden');
  document.getElementById('loveCards').classList.remove('hidden');
}

function showLoveCards() {
  document.getElementById('lovePopup').classList.add('hidden');
  document.getElementById('loveCards').classList.remove('hidden');
  startTypewriter();
}

let typeInterval;
let fullLoveText = `Okay obviously you love to hear this again and again.
And since it's been so many years and your memory kinda fades away every 2 days, let me tell you how it all started. The day was 25th Jan 2017. It was cold and I just wanted to talk to some pretty girls on Facebook. I was just typing some random names in the search bar and sending requests to the ones who looked pretty lol I know kinda hoe ass behaviour on my part but hey what can you expect from a kid longing for a titty? Well then out of nowhere my eyes fell on this one picture of a girl with a dog filter. She looked like the most cutest girl I ever saw and I wanted to know her more so I hit that button and guess what!? She wanted to know bout me too! 
(Okay future piyush here- No bruh she just wanted to hoe around and get that d! Innocent me fell for it) 
Well good thing that I did, cause what I experienced after that was just something sort of magical. Talking to her everyday bout useless things was starting to make sense now. I was liking her company. For the first time I felt like I can really connect to this person. I loved whenever she laughed at my silly and unfunny jokes. Being there for her and with her felt like a natural thing to me. Day by day I was falling for her even more. I was doing crazy things for her I never did for anyone without even thinking bout them just because to make her feel good. She used to jokingly say that she don't believe in love and no one can love her and I used to joke along but inside my heart, I wanted to change that. I wanted to tell her that she deserves the best kinda love that ever existed and I wanted to give it to her. I wanted to be her happiness. I wanted to be one for her who she can trust at every moment in her life. With whom she can share all her little joys and sadness with it and with whom she could just laugh for days. Months were feeling like days and years felt like a week but then we started to grew apart. I was getting too attached to her. The thought bout her being with someone else started to give me anxiety. How could I let someone have my only person that I cared for? We started having fights and then one day it all stopped. We fell apart. The thought bout sending her a message felt like disturbing her. Years passed by but I couldn't collect myself to somehow force myself back in that bubble of her life. I wanted her back. I wanted my booboo back. I remember that she once told me about soulmates. I never believed it at that time. It just felt like a magic to me..
And well just like magic and 4 years later, she enters back again in my life. Still looking as beautiful as always. Still crazy for dicks, still crazy in general. Just how I remembered her. Everything started to feel colorful again. It didn't even feel like I didn't talk to her for years. We still had that chemistry. She was still the best girl I could ever ask for and this time I wanted her for good. No more games. I wanted to love her like no one ever did. I wanted to make her feel special and I was ready to do anything for that. I'm writing this on 11th Sept 2024. It's been like 7 years since I've known her and I still can't believe that I asked her out and she even said yes. Pagli kahi ki lol! But tbh I didn't even know if you felt the same way for me and I was still kinda hesitant. I even used to think that do I even deserve someone as special as her in my life!?😭 But you've changed me into a more confident person now. I know now what I want and how I need to fight for it. I ain't letting you go this time booboo. I will never let you down baby. I love you sooo much sonaa and I'll forever do that. I promise❤️
I loveeee everything bout you my baby girl. You got those eyes👁️ that I can stare at for countless nights. I used to think a whale's 🐱is the deepest thing but no your eyes are even deeper. I love when you put your gandi nazar on my prince parts too lol. Your lips👄 are the lips that I can kiss till I'm out of breath and I'd still not stop cause who tf needs air when it's this polluted anyway! Your legs 🍗 is where I wanna be. I wanna cherish those thighs soo much and get myself squeezed in there like the way you squeeze a nimbu!
Then I wanna per that kitty🐱 so much that my fishes would feel jealous and then I wanna fuck you where you just can stop asking for more baby💋. Okay how can I forgot those 2 babies of mine! They are soo perfect and soft like the comfiest pillows and I wanna suck them so much 😭. Saved that cake 🍑 for the last hehe👋 I'm gonna grab it and spank it till I see my hand print on it and that's how I wanna claim that ass! Okay I did get a lil steamy back there lol
Ayy wait! How can I forget bout your smile and your laugh!! It's the most sweetest laugh I have ever heard in my life! I don't care bout my happiness, I just want to make you as happy as I can baby. Everytime I think bout marrying you, my hearts just keep on bearinh faster. I just feel so lucky that I can call you my woman now. Thanks for showing me what true love really means. I may not write these letters everyday now but I wanna tell you that you mean the world to me. The day you came in my life, it just changed into something so beautiful and meaningful. I may not the be the first guy to make you feel loved but I'll make damn sure that I'll be the one who will make you feel loved to the core! Thank you for everything baby. Thank you for being a home outside of my own home. When I felt I couldn't go to anyone, you gave me reassurance that I can come to you and everything will be all sonal-ified then. Thank you for giving me a piece of your heart. I couldn't have asked for anything better than this in the entire world! 🌎 
Okay now coming back to my baby's birthday! 
I've planned few things for you and I think this is gonna be a part of it. Expect some silly things cause you know how I am😭. Well I hope you do like them. Also did you like the flowers? Okay not as beautiful as my girl but they look so perfect with you. Also coming to your gifts, you already have the perfect man of your dreams with you! What else do you need now? Acha bubba stop crying, I did get you some things and they'll keep on coming to you till few days lol and I hope you like them too. Btw there's a surprise one as well *wink wink* 
Okay latest piyush here! 
Happppyyy birthdayyy bubbaaa!!!!🎉🎉🎊🎊🥳🥳🎂🎂🎈🎈
Mere sonaaa💋💋❤️❤️❤️
You've grown up soo much baby but for me you'll always be my little babygirl hehe 
May that holy jesus bless you baby. I mean he adjust blessed you with my dick so how much even more blessings do you need? 
Okay fun fact, the number of dicks that you see floating around here is actually the number of times you have thought bout riding one!
Have a great day my love❤️
Your next one is gonna be even more special 👩‍❤️‍👨`;

function startTypewriter() {
  const output = document.getElementById('typewriterText');
  const skipBtn = document.getElementById('skipTypewriter');
  output.innerHTML = "";
  let i = 0;

  typeInterval = setInterval(() => {
    if (i < fullLoveText.length) {
      output.innerHTML += fullLoveText.charAt(i);
      i++;
    } else {
      clearInterval(typeInterval);
    }
  }, 30);

  // Show the skip button after 10 seconds
  setTimeout(() => {
    skipBtn.classList.remove('hidden');
  }, 10000);
}

function revealFullLove() {
  clearInterval(typeInterval);
  document.getElementById('typewriterText').innerText = fullLoveText;
  document.getElementById('skipTypewriter').classList.add('hidden');
}

function spawnPartyPoppers() {
  setInterval(() => {
    const popper = document.createElement('div');
    popper.className = 'party-popper';

    // Log to check if poppers are being created
    console.log("Party popper created!");

    popper.textContent = '🎉'; // Emoji party popper

    // Random positioning
    const randomTop = Math.random() * 80 + 10;
    const randomLeft = Math.random() * 90 + 5;

    popper.style.top = `${randomTop}%`;
    popper.style.left = `${randomLeft}%`;

    document.body.appendChild(popper);

    setTimeout(() => {
      popper.remove();
    }, 3000);
  }, 500);
}


const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js";
document.body.appendChild(script);
