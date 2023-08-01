import { Button, ChoiceList, FormLayout, Popover } from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import { useAppQuery } from "../../hooks";

const VisibilityHome = (props) => {
  const [popoverActive, setPopoverActive] = useState(false);
  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const activator = (
    <Button onClick={togglePopoverActive} disclosure>
      Visibility
    </Button>
  );

  const [selectedChoice, setSelectedChoice] = useState([""]);

  const handleChange = useCallback((value) => {
    setSelectedChoice(value);
    setVisibleStatus(value);
    setLoading(true);
    setTagName((prev) => (value[0] === "published" ? "Visible" : "Hidden"));
  }, []);

  return (
    <Popover
      active={popoverActive}
      activator={activator}
      onClose={togglePopoverActive}
      ariaHaspopup={false}
      sectioned
    >
      <ChoiceList
        choices={[
          { label: "Visible", value: "published" },
          { label: "Hidden", value: "unpublished" },
        ]}
        selected={selectedChoice}
        onChange={handleChange}
      />
      <p
        className={`clearFilter ${visibleStatus && "activeClearFilter"}`}
        onClick={removeTag}
      >
        Clear
      </p>
    </Popover>
  );
};

export default VisibilityHome;
