import "whatwg-fetch";
import "core-js/features/promise";
import { csrfToken } from "@rails/ujs";
import { fetchStatus } from "../../js/util";

// https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
const vh = window.innerHeight * 0.01;

const vidyardPlayers = document.querySelectorAll(".vidyard-player");
if (vidyardPlayers.length) {
  Array.from(vidyardPlayers).forEach((vidyardPlayer) => {
    const COMPLETE_PERCENT = 90;
    const updateStatus = (percentComplete) => {
      const { status: currentStatus, slug } = vidyardPlayer.dataset;
      const newStatus =
        percentComplete >= COMPLETE_PERCENT ? "completed" : "watched";

      if (currentStatus !== newStatus && currentStatus !== "completed") {
        vidyardPlayer.dataset.status = newStatus;
        fetch(`/users/watch/${slug}.json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-Token": csrfToken(),
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        })
          .then((resp) => fetchStatus(resp))
          .catch((error) => {
            console.log("request failed", error);
          });
      }
    };

    const backToModule = () => {
      const { module, slug, bundle } = vidyardPlayer.dataset;
      if (bundle || (module && slug)) {
        const backLink = bundle.length
          ? `/program/bundles/${bundle}`
          : `/program/modules/${module}#${slug}`;
        window.location.href = backLink;
      }
    };

    document.addEventListener("onVidyardAPI", ({ detail: vidyardEmbed }) => {
      vidyardEmbed.api.addReadyListener((_, player) => {
        const { metadata } = player || {};
        const { length_in_seconds: length } = metadata || {};
        const progressPct = [1, COMPLETE_PERCENT];
        document.documentElement.style.setProperty("--vh", `${vh}px`);
        vidyardPlayer.dataset.ready = player.ready();
        vidyardEmbed.api.progressEvents(
          ({ event }) => updateStatus(event),
          progressPct
        );
        player.on("seek", (seekTimes) =>
          updateStatus((seekTimes[1] / length) * 100)
        );
        player.on("playerComplete", () => updateStatus(100) && backToModule());
      }, vidyardPlayer.dataset.uuid);
    });
  });

  const videoNav = document.querySelector(".video-module__nav");
  const toggleBehaviorNav = document.getElementById("toggle-behavior-nav");
  if (videoNav && toggleBehaviorNav) {
    toggleBehaviorNav.addEventListener("click", () => {
      videoNav.classList.toggle("video-module__nav--open");
    });
  }
}
