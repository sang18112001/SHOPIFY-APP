import { LegacyCard, Text, TextField } from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import { parserHTML } from "../../utils";

const SearchEngine = ({ title, content }) => {
  const [editWithSeo, setEditWithSeo] = useState(false);
  const [titleSeo, setTitleSeo] = useState(title);
  const [titleSeoDefault, setTitleSeoDefault] = useState(title);
  const [descrSeo, setDecrSeo] = useState(content);
  const [descrSeoDefault, setDecrDefault] = useState(content);
  const [urlSeo, setUrlSeo] = useState("");
  useEffect(() => {
    setTitleSeoDefault(title);
    setDecrDefault(content);
  }, [title, content]);

  const handleChangeTitleSeo = useCallback((value) => setTitleSeo(value), []);

  const handleChangeDecrSeo = useCallback((value) => setDecrSeo(value), []);

  const handleChangeUrlSeo = useCallback((value) => setUrlSeo(value), []);
  return (
    <LegacyCard
      title="Search engine listing preview"
      actions={[
        {
          content: editWithSeo ? "" : "Edit website SEO",
          onAction: () => setEditWithSeo(true),
        },
      ]}
    >
      <LegacyCard.Section>
        {title.trim() && parserHTML(content).trim() ? (
          <div>
            <p style={{ fontSize: "18px", color: "#1a0dab" }}>
              {editWithSeo && titleSeo ? titleSeo : title}
            </p>
            <Text
              color="success"
              as="h6"
            >{`https://quickstart-af1f2d54.myshopify.com/pages/${title}`}</Text>
            <p style={{ fontSize: "13px" }}>{content}</p>
          </div>
        ) : (
          <p>
            {` Add ${
              titleSeo.trim() !== "" || title.trim() !== "" ? "" : "a title"
            } ${
              titleSeo.trim() === "" &&
              parserHTML(descrSeo).trim() === "" &&
              title.trim() === "" &&
              content.trim() === ""
                ? "and"
                : ""
            }  ${
              parserHTML(descrSeo).trim() !== "" || content.trim() !== ""
                ? ""
                : "description"
            } to see how this Page might appear in a
            search engine listing`}
          </p>
        )}
      </LegacyCard.Section>

      {editWithSeo && (
        <LegacyCard.Section>
          <div style={{ marginBottom: "10px" }}>
            <TextField
              label="Page title"
              type="text"
              value={titleSeo}
              placeholder={titleSeoDefault}
              onChange={handleChangeTitleSeo}
              helpText={`${titleSeo.length} of 70 characters used`}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <TextField
              label="Description"
              multiline={4}
              value={parserHTML(descrSeo)}
              placeholder={descrSeoDefault}
              onChange={handleChangeDecrSeo}
              helpText={`${parserHTML(descrSeo).length} of 320 characters used`}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <TextField
              label="URL and handle"
              type="text"
              prefix="https://quickstart-af1f2d54.myshopify.com/pages/"
              placeholder={title}
              onChange={handleChangeUrlSeo}
            />
          </div>
        </LegacyCard.Section>
      )}
    </LegacyCard>
  );
};

export default SearchEngine;
