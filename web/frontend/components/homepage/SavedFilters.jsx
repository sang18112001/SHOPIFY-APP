import React from "react";
import { Button, Tag, TextField } from "@shopify/polaris";
import { useState, useCallback } from "react";

export function BoxSavedFilters(props) {
  const { tagName, visibleStatus, query, togglePopoverActive, refetch } = props;
  const [text, setText] = useState("");

  const handleTextFilter = useCallback((value) => setText(value), []);
  const handleSaveFilter = () => {
    const local = localStorage.getItem("filters");
    const newFilter = {
      title: text,
      visibleStatus: visibleStatus || null,
      query,
    };
    const newLocalFilter = local
      ? [...JSON.parse(local).saveFilters, newFilter]
      : [newFilter];
    const obLocalFilter = {
      saveFilters: newLocalFilter,
    };
    localStorage.setItem("filters", JSON.stringify(obLocalFilter));
    refetch();
  };
  return (
    <div style={{ padding: "16px", width: "380px", height: "auto" }}>
      {tagName && (
        <div style={{ marginBottom: "10px" }}>
          <Tag>Visibility is {tagName}</Tag>
        </div>
      )}
      <TextField
        label="Save as"
        type="email"
        value={text}
        onChange={handleTextFilter}
        placeholder="Ready to publish, work in progess"
        helpText="Filters are saved as a new tab at the top of this list."
      />

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          marginTop: "12px",
        }}
      >
        <Button onClick={togglePopoverActive}>Cancel</Button>
        <Button
          primary
          disabled={text.trim() !== "" ? false : true}
          onClick={handleSaveFilter}
        >
          Save filters
        </Button>
      </div>
    </div>
  );
}
