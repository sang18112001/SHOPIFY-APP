import { Frame, ContextualSaveBar, Modal } from "@shopify/polaris";
import React, { useState } from "react";

export default function ContextualBar({
  handleUpdatePage,
  handleDiscardChanges,
  loading,
}) {
  const [modal, setModal] = useState(false);
  return (
    <>
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        fullScreen={true}
        title={`Discard all unsaved changes`}
        primaryAction={{
          content: "Discard changes",
          destructive: true,
          onAction: () => {
            setModal(false);
            handleDiscardChanges();
          },
        }}
        secondaryActions={[
          {
            content: "Continue editing",
            onAction: () => setModal(false),
          },
        ]}
      >
        <Modal.Section>
          <p>
            If you discard changes, you’ll delete any edits you made since you
            last saved.
          </p>
        </Modal.Section>
      </Modal>
      <div style={{ height: "50px", overflow: "hidden" }}>
        <Frame>
          <ContextualSaveBar
            alignContentFlush
            message="Unsaved changes"
            saveAction={{
              loading: loading,
              onAction: handleUpdatePage,
            }}
            discardAction={{
              onAction: () => setModal(true),
            }}
          />
        </Frame>
      </div>
    </>
  );
}
