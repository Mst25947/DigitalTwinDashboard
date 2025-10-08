import { Router } from "@vaadin/router";

import "../pages/bob-game-page";
import "../pages/resultaten-page";

const outlet = document.getElementById("outlet");
const router = new Router(outlet, { baseUrl: "/dashboard/" });

router.setRoutes([
  { path: "/", redirect: "/bob-game" },
  { path: "/bob-game", component: "bob-game-page" },
  { path: "/resultaten", component: "resultaten-page" },
]);

export default router;
