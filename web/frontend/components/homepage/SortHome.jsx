import { Button, ChoiceList, FormLayout, Popover } from "@shopify/polaris";
import React, { useCallback, useState } from "react";
import { SortMinor } from "@shopify/polaris-icons";
const SortHome = ({ typeSort, setLoading, refetch, setTypeSort }) => {
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((prev) => !prev),
    []
  );

  const activator = (
    <Button icon={SortMinor} onClick={togglePopoverActive} disclosure>
      Sort
    </Button>
  );

  const [selectedChoice, setSelectedChoice] = useState(["new"]);

  const handleChange = useCallback((value) => {
    setSelectedChoice(value);
    setLoading(true);
    refetch();
    setTypeSort(value[0]);
  }, []);
  return (
    <Popover
      active={popoverActive}
      activator={activator}
      onClose={togglePopoverActive}
      ariaHaspopup={false}
      sectioned
    >
      <FormLayout>
        <ChoiceList
          title="Sort by"
          choices={[
            { label: "New Update", value: "new" },
            { label: "Oldest Update", value: "old" },
            { label: "Title A-Z", value: "az" },
            { label: "Title Z-A", value: "za" },
          ]}
          selected={selectedChoice}
          onChange={handleChange}
          hideClearButton
        />
      </FormLayout>
    </Popover>
  );
};

export default SortHome;
