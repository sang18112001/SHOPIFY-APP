import { LegacyCard, EmptyState } from "@shopify/polaris";
import React from "react";

export default function EmptyFilter() {
  return (
    <LegacyCard sectioned>
      <EmptyState
        heading="Manage your inventory transfers"
        action={{ content: "Add transfer" }}
        secondaryAction={{
          content: "Learn more",
          url: "https://help.shopify.com",
        }}
        image="data:image/svg+xml,%3csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' d='M41.87 24a17.87 17.87 0 11-35.74 0 17.87 17.87 0 0135.74 0zm-3.15 18.96a24 24 0 114.24-4.24L59.04 54.8a3 3 0 11-4.24 4.24L38.72 42.96z' fill='%238C9196'/%3e%3c/svg%3e"
      >
        <p>Track and receive your incoming inventory from suppliers.</p>
      </EmptyState>
    </LegacyCard>
  );
}
