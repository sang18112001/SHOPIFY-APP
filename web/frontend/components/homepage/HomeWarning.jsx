import { Banner } from "@shopify/polaris";
import React from "react";
import { LockMinor } from "@shopify/polaris-icons";

export function HomeWarning() {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <Banner
        title="
      Store access is restricted"
        status="warning"
        action={{
          content: "See store password",
          url: "https://admin.shopify.com/store/quickstart-af1f2d54/online_store/preferences?tutorial=unlock",
        }}
        icon={LockMinor}
      >
        <p>
          While your online store is in development, only visitors with the
          password can access it.
        </p>
      </Banner>
    </div>
  );
}
