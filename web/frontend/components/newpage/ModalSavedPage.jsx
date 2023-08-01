import { useNavigate } from "@shopify/app-bridge-react";
import { Button, Modal, TextContainer } from "@shopify/polaris";
import { useState, useCallback } from "react";

function ModalSavedPage({ modalSave, setModalSave }) {
  const handleChange = useCallback(() => setModalSave(!modalSave), [modalSave]);
  const navigate = useNavigate();
  return (
    <Modal
      open={modalSave}
      onClose={handleChange}
      title="You have unsaved changes"
      primaryAction={{
        content: "Leave page",
        onAction: () => navigate("/"),
        destructive: true
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: handleChange,
        },
      ]}
    >
      <Modal.Section>
        <p>If you leave this page, all unsaved changes will be lost.</p>
      </Modal.Section>
    </Modal>
  );
}

export default ModalSavedPage;
