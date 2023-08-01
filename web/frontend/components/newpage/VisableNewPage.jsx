import { LegacyCard, ChoiceList, Button } from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import { SetDate } from "./SetDate";

const VisableNewPage = ({ setVisible }) => {
  const [selected, setSelected] = useState(["Visable"]);
  const [willVisible, setWillVisible] = useState(false);
  const handleChange = useCallback((value) => {
    setSelected(value);
    setWillVisible(false);
    setVisible(value[0] === "Visable");
  }, []);
  const getDay = new Date().toLocaleDateString();
  const getTime =
    new Date().toLocaleTimeString().slice(0, 4) +
    " " +
    new Date().toLocaleTimeString().slice(-3);

  const [willDate, setWillDate] = useState(getDay);
  const labelVisible =
    selected[0] === `Visable`
      ? `Visable (as of ${getDay}, ${getTime} EDT)`
      : `Visable`;
  const labelHidden = willVisible
    ? `Hidden (will become visible on ${willDate}, ${getTime} EDT)`
    : "Hidden";
  return (
    <LegacyCard sectioned title="Visibility">
      <ChoiceList
        choices={[
          {
            label: labelVisible,
            value: "Visable",
          },
          { label: labelHidden, value: "Hidden" },
        ]}
        selected={selected}
        onChange={handleChange}
      />
      {willVisible && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            margin: "16px 0px",
          }}
        >
          <SetDate setWillDate={setWillDate}/>
        </div>
      )}
      <div style={{ marginTop: "16px" }}>
        <Button
          onClick={() => {
            setWillVisible((prev) => !prev);
            setSelected(["Hidden"]);
          }}
          plain
        >
          {willVisible ? "Clear date..." : "Set visibility date"}
        </Button>
      </div>
    </LegacyCard>
  );
};

export default VisableNewPage;
