// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

// Get pages
app.get("/api/pages", async (req, res) => {
  const id = req.query.id;
  const published_status = req.query.published_status;
  if (id) {
    let pagesData = await shopify.api.rest.Page.find({
      session: res.locals.shopify.session,
      // @ts-ignore
      id,
    });
    res.status(200).send(pagesData);
  } else {
    let pagesData = await shopify.api.rest.Page.all({
      session: res.locals.shopify.session,
      published_status: published_status,
    });
    res.status(200).send(pagesData);
  }
});

// Create a new page
app.post("/api/pages", async (req, res) => {
  const data = req.body;
  const pagesData = new shopify.api.rest.Page({
    session: res.locals.shopify.session,
  });
  pagesData.title = data?.title;
  pagesData.body_html = data?.body_html || "";
  pagesData.published = data?.published;
  await pagesData
    .save({ update: true })
    .catch((error) => console.log("Error: ", error));
  res.status(200).send(pagesData);
});

// Delete page
app.delete("/api/pages", async (req, res) => {
  // @ts-ignore
  const ids = req.query.id?.split(","); // Split comma-separated IDs into an array
  const deletePromises = ids.map((id) =>
    shopify.api.rest.Page.delete({
      session: res.locals.shopify.session,
      id: id,
    })
  );
  const pagesData = await Promise.all(deletePromises);
  res.status(200).send(pagesData);
});

// Update pages
app.put("/api/pages", async (_req, res) => {
  // @ts-ignore
  const ids = _req.query.id?.split(",");
  const published = _req.body.published;
  const title = _req.body.title;
  const body_html = _req.body.body_html;

  if (title || body_html) {
    const page = new shopify.api.rest.Page({
      session: res.locals.shopify.session,
    });
    page.id = ids[0];
    page.title = title;
    page.published = published;
    page.body_html = body_html;
    await page.save({
      update: true,
    });
    res.status(200).send(page);
  } else if (ids) {
    const updatePageStatus = ids.map(async (id) => {
      const page = new shopify.api.rest.Page({
        session: res.locals.shopify.session,
      });
      page.id = id;
      page.published = published;
      await page.save({
        update: true,
      });
    });
    const pagesData = await Promise.all(updatePageStatus);
    res.status(200).send(pagesData);
  }
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
