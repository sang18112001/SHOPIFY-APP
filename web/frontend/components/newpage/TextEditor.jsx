import {
  ButtonGroup,
  Tooltip,
  Button,
  Text,
  LegacyCard,
} from "@shopify/polaris";
import React, { useEffect } from "react";
import { FaBold, FaItalic, FaUnderline } from "react-icons/fa";
import { getSelectedHTML, hasSingleBTagsPair, modifiedText } from "../../utils";
const TextEditor = ({ editorRef, content, handleContentChange }) => {
  const applyTextStyle = (style) => {
    const selection = window.getSelection();
    const selectedHtml = getSelectedHTML(selection);
    const selectedText = selection.toString();
    const innerHTMLText = editorRef.current.innerHTML;
    console.log("selectedHtml: ", selectedHtml);
    const regex_g = new RegExp(`<${style}>(.*?)</${style}>`, "g");
    const regex_close = new RegExp(`<\/${style}>`, "g");
    const regex_open = new RegExp(`<${style}>`, "g");
    const regex_final = new RegExp(`</${style}>$`);
    const matches = innerHTMLText.match(regex_g); // Get list style
    const itemUnStyle = `<${style}>${selectedText}</${style}>`;
    const itemStyle = `</${style}>${selectedText}<${style}>`;
    var newInnerHtml = innerHTMLText;
    console.log("innerHTMLText before: ", innerHTMLText);
    console.log(hasSingleBTagsPair(selectedHtml, style))
    if (!selectedText) return;
    if (!matches) {
      const convertedString = innerHTMLText.replace(
        selectedText,
        itemUnStyle
      );
      newInnerHtml = convertedString;
    } else {
      switch (hasSingleBTagsPair(selectedHtml, style)) {
        case 0:
          var isStyle = false;
          matches.forEach((match, index) => {
            const tempElement = document.createElement("div");
            tempElement.innerHTML = match;
            const concatenatedText = tempElement.textContent;
            if (concatenatedText.includes(selectedText)) isStyle = true;
          });
          newInnerHtml = isStyle
            ? innerHTMLText.replace(selectedHtml, itemStyle)
            : innerHTMLText.replace(selectedHtml, itemUnStyle);
          break;

        case 1:
          const firstRemove = selectedHtml.replace(`<${style}>`, "");
          const newText1 = firstRemove
            .replace(regex_close, "")
            .replace(regex_open, "");
          newInnerHtml = innerHTMLText.replace(
            firstRemove,
            newText1 + `</${style}>`
          );
          break;

        case 2:
          const finalRemove = selectedHtml.replace(regex_final, "");
          const newText2 = finalRemove
            .replace(regex_close, "")
            .replace(regex_open, "");
          newInnerHtml = innerHTMLText.replace(
            finalRemove,
            `<${style}>` + newText2
          );
          break;

        case 3:
          const firstRemove2 = selectedHtml.replace(`<${style}>`, "");
          const finalRemove2 = firstRemove2.replace(regex_final, "");
          const newText3 = finalRemove2
            .replace(regex_close, "")
            .replace(regex_open, "");
          newInnerHtml = innerHTMLText.replace(finalRemove2, newText3);
          break;

        case 4:
          const newText4 = selectedHtml
            .replace(regex_close, "")
            .replace(regex_open, "");
          newInnerHtml = innerHTMLText.replace(
            selectedHtml,
            `<${style}>${newText4}</${style}>`
          );
          break;

        default:
          // Handle the default case if needed
          break;
      }
    }
    editorRef.current.innerHTML = modifiedText(newInnerHtml);
  };
  useEffect(() => {
    editorRef.current.innerHTML = content || "";
  }, []);
  return (
    <div style={{ marginTop: "16px" }}>
      <Text>Content</Text>
      <div style={{ marginTop: "0.25rem" }}>
        <LegacyCard>
          <LegacyCard.Section subdued>
            <div style={{ margin: "-10px" }}>
              <ButtonGroup segmented>
                <Tooltip content="Bold" dismissOnMouseOut>
                  <Button
                    icon={<FaBold />}
                    onClick={() => applyTextStyle("b")}
                  />
                </Tooltip>
                <Tooltip content="Italic" dismissOnMouseOut>
                  <Button
                    icon={<FaItalic />}
                    onClick={() => applyTextStyle("i")}
                  />
                </Tooltip>
                <Tooltip content="Underline" dismissOnMouseOut>
                  <Button
                    icon={<FaUnderline />}
                    onClick={() => applyTextStyle("u")}
                  />
                </Tooltip>
              </ButtonGroup>
            </div>
          </LegacyCard.Section>
          <LegacyCard.Subsection>
            <div
              ref={editorRef}
              contentEditable
              onInput={(e) => handleContentChange(e.currentTarget.textContent)}
              spellCheck="false"
              style={{
                border: "2px solid #ccc",
                padding: "5px",
                lineHeight: "1.6",
                outline: "none",
                height: "150px",
              }}
            ></div>
          </LegacyCard.Subsection>
        </LegacyCard>
      </div>
    </div>
  );
};

export default TextEditor;
