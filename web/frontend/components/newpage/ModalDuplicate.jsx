import { Modal, TextField } from "@shopify/polaris";
import React, { useCallback } from "react";

const ModalDuplicate = (props) => {
  const { duplicate, setDuplicate, handleDuplicate, newTitle, setNewTitle, loading } =
    props;

  const handleChange = useCallback((newValue) => setNewTitle(newValue), []);
  return (
    <Modal
      open={duplicate}
      onClose={() => setDuplicate(false)}
      fullScreen={true}
      title={`Duplicate this page?`}
      primaryAction={{
         loading: loading,
        content: "Duplicate",
        destructive: true,
        onAction: handleDuplicate,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: () => setDuplicate(false),
        },
      ]}
    >
      <Modal.Section>
        <TextField
          label="Provide a name for your new page"
          value={newTitle}
          onChange={handleChange}
          autoComplete="off"
        />
      </Modal.Section>
    </Modal>
  );
};

export default ModalDuplicate;
