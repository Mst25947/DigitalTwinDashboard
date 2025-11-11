import { Router } from "@vaadin/router";
import "../pages/bob-game-page.js";
import "../pages/resultaten-page.js";
import "../pages/unity-game-page.js";

window.addEventListener("DOMContentLoaded", () => {
  const outlet = document.getElementById("outlet");
  const router = new Router(outlet);
  router.setRoutes([
    { path: "/", redirect: "/resultaten" },
    { path: "/bob-game", component: "unity-game-page" },
    { path: "/resultaten", component: "resultaten-page" },
  ]);
});