import { Router } from "@vaadin/router";
import "../pages/resultaten-page.js";
import "../pages/unity-game-page.js";

window.addEventListener("DOMContentLoaded", () => {
  const outlet = document.getElementById("outlet");

  const baseUrl = location.pathname.startsWith("/bob-game")
    ? "/bob-game"
    : "/";

  const router = new Router(outlet, { baseUrl });

  router.setRoutes([
    { path: "/", component: "unity-game-page" },
    { path: "/resultaten", component: "resultaten-page" },
  ]);
});
