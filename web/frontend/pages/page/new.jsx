import {
  LegacyCard,
  Button,
  Layout,
  Page,
  ButtonGroup,
  VerticalStack,
  Divider,
  TextField,
  Frame,
  ContextualSaveBar,
  Toast,
} from "@shopify/polaris";
import { useAuthenticatedFetch, useNavigate } from "@shopify/app-bridge-react";
import { DuplicateMinor, ViewMajor } from "@shopify/polaris-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import VisableNewPage from "../../components/newpage/VisableNewPage";
import OnlineStore from "../../components/newpage/OnlineStore";
import TextEditor from "../../components/newpage/TextEditor";
import SearchEngine from "../../components/newpage/SearchEngine";
import ModalSavedPage from "../../components/newpage/ModalSavedPage";

const NewPage = () => {
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [visible, setVisible] = useState(true);
  const [checkSave, setCheckSave] = useState(true);
  const [modalSave, setModalSave] = useState(false);
  const fetch = useAuthenticatedFetch();
  const handleTitle = useCallback((newvalue) => setTitle(newvalue), []);
  const handleContentChange = (value) => setContent(value);
  useEffect(() => {
    setCheckSave(!visible || title);
  }, [visible, title]);

  // Handle new page
  const handleNewPage = () => {
    const newPage = {
      title: title,
      body_html: editorRef?.current?.innerHTML || "",
      published: visible ? true : null,
    };
    fetch("/api/pages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPage),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLoading(true);
        localStorage.setItem("checkCreate", "true");
        navigate(`/page/${data.id}`);
      });
  };

  // Handle back action
  const handleBackAction = () => {
    if (!checkSave) navigate("/");
    else setModalSave(true);
  };

  return (
    <>
      <div style={{ height: "50px", overflow: "hidden" }}>
        <Frame>
          <ContextualSaveBar
            alignContentFlush
            message="Unsaved changes"
            saveAction={{
              disabled: !checkSave,
              loading: loading,
              onAction: handleNewPage,
            }}
            discardAction={{
              onAction: () => navigate("/"),
            }}
          />
        </Frame>
      </div>
      <ModalSavedPage modalSave={modalSave} setModalSave={setModalSave} />
      <Page
        backAction={{ content: "Add Page", onAction: handleBackAction }}
        title="Page"
      >
        <VerticalStack>
          <Layout>
            <Layout.Section>
              <LegacyCard sectioned>
                <TextField
                  label="Title"
                  value={title}
                  onChange={handleTitle}
                  placeholder="e.g. Contact us, Sizing chat, FAQs "
                />
                <TextEditor
                  editorRef={editorRef}
                  content={content}
                  handleContentChange={handleContentChange}
                />
              </LegacyCard>
              <SearchEngine title={title} content={content} />
            </Layout.Section>
            <Layout.Section secondary>
              <VisableNewPage setVisible={setVisible} content={content} />
              <OnlineStore />
            </Layout.Section>
          </Layout>
          <div style={{ padding: "20px 0px" }}>
            <Divider />
          </div>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <ButtonGroup>
              <Button onClick={() => navigate("/")}>Cancel</Button>
              <Button
                loading={loading}
                disabled={!checkSave}
                primary
                onClick={handleNewPage}
              >
                Save
              </Button>
            </ButtonGroup>
          </div>
        </VerticalStack>
      </Page>
    </>
  );
};

export default NewPage;
