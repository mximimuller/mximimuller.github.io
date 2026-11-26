<script setup>
import ShaderBackground from "./ShaderBackground.vue";
import xLogo from "./assets/x-logo.png";
import tiktokLogo from "./assets/tiktok-logo.png";
import githubLogo from "./assets/github-logo.png";

const profiles = [
  {
    platform: "X",
    handle: "@MximiMuller",
    url: "https://x.com/MximiMuller",
    icon: xLogo,
    height: 52,
    iconClass: "x-logo",
  },
  {
    platform: "TikTok",
    handle: "@maximilian.muller10",
    url: "https://www.tiktok.com/@maximilian.muller10",
    icon: tiktokLogo,
    height: 52,
    iconClass: "tiktok-logo",
  },
  {
    platform: "GitHub",
    handle: "@mximimuller",
    url: "https://github.com/mximimuller",
    icon: githubLogo,
    height: 47,
    iconClass: "github-logo",
  },
];
</script>

<template>
  <ShaderBackground />
  <main>
    <div>
      <h1><span>I'm</span> Maximilian Muller</h1>
      <nav class="social-links" aria-label="Social profiles">
        <a
          v-for="profile in profiles"
          :key="profile.platform"
          class="profile-link"
          :href="profile.url"
          :aria-label="`${profile.handle} on ${profile.platform}`"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img :class="profile.iconClass" :src="profile.icon" alt="" width="48" :height="profile.height">
          <span>{{ profile.handle }}</span>
        </a>
      </nav>
    </div>
  </main>
</template>

<style>
@font-face {
  font-family: "Geist";
  src: url("./assets/geist-latin.woff2") format("woff2");
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
}

html {
  background-color: #edf0f5;
}

body {
  margin: 0;
  color: #171716;
  font-family: "Geist", system-ui, -apple-system, sans-serif;
}

.shader-background {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  height: 100dvh;
  background:
    radial-gradient(ellipse at 88% 18%, #e8edff 0%, transparent 60%),
    radial-gradient(ellipse at 8% 90%, #f8e5db 0%, transparent 56%) #fdfdfc;
  pointer-events: none;
}

@media (hover: none) and (pointer: coarse) {
  .shader-background {
    mask-image: linear-gradient(transparent, black 9%, black 91%, transparent);
  }
}

main {
  position: relative;
  box-sizing: border-box;
  min-block-size: 100vh;
  min-block-size: 100dvh;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  padding-top: max(1.5rem, env(safe-area-inset-top, 0px));
  padding-right: max(1.5rem, env(safe-area-inset-right, 0px));
  padding-bottom: max(1.5rem, env(safe-area-inset-bottom, 0px));
  padding-left: max(1.5rem, env(safe-area-inset-left, 0px));
  text-align: center;
}

h1 {
  margin: 0;
  font-size: clamp(2.5rem, 8vw, 7rem);
  font-weight: 650;
  letter-spacing: -0.025em;
  line-height: 1.06;
}

h1 span {
  display: block;
  margin-block-end: 0.2em;
  font-size: 0.47em;
  font-weight: 500;
  letter-spacing: -0.025em;
}

.social-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem 1rem;
  margin-block-start: 1.5rem;
}

.profile-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  padding: 0.4rem 0.65rem;
  border-radius: 999px;
  color: #535352;
  font-size: 0.875rem;
  text-decoration: none;
}

.profile-link:hover,
.profile-link:focus-visible {
  background-color: rgb(0 0 0 / 0.08);
}

.profile-link img {
  inline-size: 1em;
  block-size: auto;
}

.x-logo {
  transform: scale(0.9);
}

.tiktok-logo {
  transform: scale(1.12);
}

.github-logo {
  transform: scale(1.15);
}
</style>
