const {
  gsap,
  gsap: { to, timeline, set, delayedCall },
  Splitting,
} = window;

Splitting();

const BTN = document.querySelector(".birthday-button");
const MODAL = document.querySelector("#letter");
const MODAL_CLOSE = document.querySelector(".modal__close");

const SOUNDS = {
  MATCH: new Audio(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/match-strike-trimmed.mp3"
  ),
  TUNE: new Audio(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/happy-birthday-trimmed.mp3"
  ),
  ON: new Audio("https://assets.codepen.io/605876/switch-on.mp3"),
  BLOW: new Audio(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/blow-out.mp3"
  ),
  POP: new Audio(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/pop-trimmed.mp3"
  ),
  HORN: new Audio(
    "https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/horn.mp3"
  ),
  BG: new Audio("bg.mp3"),
};
SOUNDS.BG.loop = true;
const EYES = document.querySelector(".cake__eyes");
const BLINK = (eyes) => {
  gsap.set(eyes, { scaleY: 1 });
  if (eyes.BLINK_TL) eyes.BLINK_TL.kill();
  eyes.BLINK_TL = gsap.timeline({
    delay: Math.floor(Math.random() * 4) + 1,
    onComplete: () => BLINK(eyes),
  });
  eyes.BLINK_TL.to(eyes, {
    duration: 0.05,
    transformOrigin: "50% 50%",
    scaleY: 0,
    yoyo: true,
    repeat: 1,
  });
};
BLINK(EYES);

const FROSTING_TL = () =>
  timeline()
    .to("#frosting", { scaleX: 1.015, duration: 0.25 }, 0)
    .to("#frosting", { scaleY: 1, duration: 1 }, 0)
    .to("#frosting", { morphSVG: ".cake__frosting--end", duration: 1 }, 0);

const SPRINKLES_TL = () =>
  timeline().to(".cake__sprinkle", { scale: 1, duration: 0.06, stagger: 0.02 });

const SPIN_TL = () =>
  timeline()
    .set(".cake__frosting-patch", { display: "block" })
    .to(
      [".cake__frosting--duplicate", ".cake__sprinkles--duplicate"],
      { x: 0, duration: 1 },
      0
    )
    .to(
      [".cake__frosting--start", ".cake__sprinkles--initial"],
      { x: 65, duration: 1 },
      0
    )
    .to(".cake__face", { x: -48.82, duration: 1 }, 0);

const flickerSpeed = 0.1;
const FLICKER_TL = timeline()
  .to(".candle__flame-outer", {
    morphSVG: "#flame-outer",
    duration: flickerSpeed,
    repeat: -1,
    yoyo: true,
  })
  .to(
    ".candle__flame-inner",
    {
      morphSVG: "#flame-inner",
      duration: flickerSpeed,
      repeat: -1,
      yoyo: true,
    },
    0
  );

const SHAKE_TL = () =>
  timeline({ delay: 0.5 })
    .set(".cake__face", { display: "none" })
    .set(".cake__face--straining", { display: "block" })
    .to(
      ".birthday-button",
      {
        onComplete: () => {
          set(".cake__face--straining", { display: "none" });
          set(".cake__face", { display: "block" });
        },
        x: 1,
        y: 1,
        repeat: 13,
        duration: 0.1,
      },
      0
    )
    .to(
      ".cake__candle",
      {
        onStart: () => {
          SOUNDS.POP.play();
          delayedCall(0.2, () => SOUNDS.POP.play());
          delayedCall(0.4, () => SOUNDS.POP.play());
        },
        onComplete: () => {
          FLICKER_TL.play();
        },
        scaleY: 1,
        duration: 0.2,
        ease: "elastic.out",
        stagger: 0.2,
      },
      0.2
    );

const FLAME_TL = () =>
  timeline()
    .to(".cake__candle", { "--flame": 1, stagger: 0.2, duration: 0.1 })
    .to("body", { "--flame": 1, "--lightness": 5, duration: 0.2, delay: 0.2 });

const LIGHTS_OUT = () =>
  timeline().to("body", {
    onStart: () => SOUNDS.BLOW.play(),
    "--lightness": 0,
    delay: 0.5,
    duration: 0.1,
    "--glow-saturation": 0,
    "--glow-lightness": 0,
    "--glow-alpha": 1,
    "--transparency-alpha": 1,
  });

const RESET = () => {
  set(".char", {
    "--hue": () => Math.random() * 360,
    "--char-sat": 0,
    "--char-light": 0,
    x: 0,
    y: 0,
    opacity: 1,
  });

  set("body", {
    "--frosting-hue": Math.random() * 360,
    "--glow-saturation": 50,
    "--glow-lightness": 35,
    "--glow-alpha": 0.4,
    "--transparency-alpha": 0,
    "--flame": 0,
  });

  set(".cake__candle", { "--flame": 0 });
  to("body", { "--lightness": 50, duration: 0.25 });

  set(".cake__frosting--end", { opacity: 0 });
  set("#frosting", {
    transformOrigin: "50% 10%",
    scaleX: 0,
    scaleY: 0,
  });

  set(".cake__frosting-patch", { display: "none" });
  set([".cake__frosting--duplicate", ".cake__sprinkles--duplicate"], {
    x: -65,
  });
  set(".cake__face", { x: -110 });
  set(".cake__face--straining", { display: "none" });
  set(".cake__sprinkle", {
    "--sprinkle-hue": () => Math.random() * 360,
    scale: 0,
    transformOrigin: "50% 50%",
  });

  set(".birthday-button", { scale: 0.6, x: 0, y: 0 });
  set(".birthday-button__cake", { display: "none" });
  set(".cake__candle", { scaleY: 0, transformOrigin: "50% 100%" });
};
RESET();

// Master Timeline
const MASTER_TL = timeline({
  onStart: () => SOUNDS.ON.play(),
  onComplete: () => {
    BTN.removeAttribute("disabled"); // <-- ini yang nge-enable lagi
  },
  paused: true,
})
  .set(".birthday-button__cake", { display: "block" })
  .to(".birthday-button", {
    scale: 1,
    duration: 0.2,
  })
  .to(".char", { "--char-sat": 70, "--char-light": 65, duration: 0.2 }, 0)
  .to(".char", {
    onStart: () => SOUNDS.HORN.play(),
    delay: 0.75,
    y: () => gsap.utils.random(-100, -200),
    x: () => gsap.utils.random(-50, 50),
    duration: () => gsap.utils.random(0.5, 1),
  })
  .to(".char", { opacity: 0, duration: 0.25 }, ">-0.5")
  .add(FROSTING_TL())
  .add(SPRINKLES_TL())
  .add(SPIN_TL())
  .add(SHAKE_TL())
  .add(FLAME_TL(), "FLAME_ON")
  .add(LIGHTS_OUT(), "LIGHTS_OUT");

SOUNDS.MATCH.onended = () => {
  MASTER_TL.play();
};

SOUNDS.TUNE.onended = () => {
  MASTER_TL.play();
  SOUNDS.BG.play(); // mainin bg.mp3
  showModal();
};

MASTER_TL.addPause("FLAME_ON", () => SOUNDS.MATCH.play());
MASTER_TL.addPause("LIGHTS_OUT", () => SOUNDS.TUNE.play());

BTN.addEventListener("click", () => {
  if (BTN.hasAttribute("disabled")) return; // blok klik kalau disabled
  BTN.setAttribute("disabled", true);
  MASTER_TL.restart();
});

// Modal Handling ✅
function showModal() {
  if (!MODAL || MODAL.classList.contains("show")) return;
  MODAL.classList.add("show");
  document.body.classList.add("modal-open"); // ⬅️ Ini penting
}

function hideModal() {
  if (!MODAL) return;
  MODAL.classList.remove("show");
  document.body.classList.remove("modal-open");
  SOUNDS.BG.pause();
  SOUNDS.BG.currentTime = 0; // reset ke awal
  RESET();
}

MODAL_CLOSE?.addEventListener("click", hideModal);
MODAL?.addEventListener("click", (e) => {
  if (e.target === MODAL) hideModal();
});

// Unmute semua sound
Object.values(SOUNDS).forEach((s) => (s.muted = false));

let wasMasterPlaying = false;
let wasTunePlaying = false;
let wasBgPlaying = false;
let wasOtherSoundsPlaying = new Map();

let visibilityTimeout;

document.addEventListener("visibilitychange", () => {
  clearTimeout(visibilityTimeout);
  visibilityTimeout = setTimeout(() => {
    if (document.hidden) {
      // Save current playing states
      wasMasterPlaying = !MASTER_TL.paused();
      wasTunePlaying = !SOUNDS.TUNE.paused;
      wasBgPlaying = !SOUNDS.BG.paused;

      // Save other sounds status (optional)
      Object.entries(SOUNDS).forEach(([key, audio]) => {
        wasOtherSoundsPlaying.set(key, !audio.paused);
        audio.pause();
      });

      if (wasMasterPlaying) MASTER_TL.pause();
    } else {
      // Restore playing states
      if (wasBgPlaying) SOUNDS.BG.play();
      if (wasTunePlaying) SOUNDS.TUNE.play();
      if (wasMasterPlaying) MASTER_TL.play();

      // Restore other sounds if needed
      wasOtherSoundsPlaying.forEach((playing, key) => {
        if (playing && key !== "BG" && key !== "TUNE") {
          SOUNDS[key].play();
        }
      });
    }
  }, 150); // delay tweakable, 150ms untuk aman
});
