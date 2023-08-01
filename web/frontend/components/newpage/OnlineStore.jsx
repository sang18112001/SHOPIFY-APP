import { LegacyCard, Select } from "@shopify/polaris";
import { useState, useCallback } from "react";

function OnlineStore() {
  const [selected, setSelected] = useState("default");

  const handleSelectChange = useCallback((value) => setSelected(value), []);

  const options = [
    { label: "Default page", value: "default" },
    { label: "contact", value: "contact" },
  ];

  return (
    <LegacyCard sectioned title="Online store">
      <Select
        label="Theme template"
        options={options}
        onChange={handleSelectChange}
        value={selected}
      />
      <p style={{marginTop: "1.25rem"}}>
        Assign a template from your current theme to define how the page is
        displayed.
      </p>
    </LegacyCard>
  );
}

export default OnlineStore;
