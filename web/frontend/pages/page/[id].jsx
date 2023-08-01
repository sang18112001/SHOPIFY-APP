import {
  Banner,
  LegacyCard,
  Button,
  Layout,
  Page,
  ButtonGroup,
  VerticalStack,
  Divider,
  TextField,
  ChoiceList,
  Modal,
  Frame,
  Loading,
  Toast,
} from "@shopify/polaris";
import { useAuthenticatedFetch, useNavigate } from "@shopify/app-bridge-react";
import { DuplicateMinor, ViewMajor } from "@shopify/polaris-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import OnlineStore from "../../components/newpage/OnlineStore";
import TextEditor from "../../components/newpage/TextEditor";
import { useParams } from "react-router-dom";
import { useAppQuery } from "../../hooks";
import ContextualBar from "../../components/ContextualBar";
import Skeleton from "../../components/SkeletonPage";
import ModalDuplicate from "../../components/newpage/ModalDuplicate";
import SearchEngine from "../../components/newpage/SearchEngine";
import ModalSavedPage from "../../components/newpage/ModalSavedPage";

// This example is for guidance purposes. Copying it will come with caveats.
const EditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const getLocal = localStorage.getItem("checkCreate");
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [toast, setToast] = useState(false);
  const [newToast, setNewToast] = useState(getLocal);
  const [content, setContent] = useState("");
  const [checkSave, setCheckSave] = useState(true);
  const [selectedVisible, setSelectedVisible] = useState([]);
  const [initVisible, setInitVisible] = useState([]);
  const [initData, setInitData] = useState({});
  const [create, setCreate] = useState(getLocal);
  const [loading, setLoading] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [modalSave, setModalSave] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const fetch = useAuthenticatedFetch();
  useEffect(() => {
    setCreate(getLocal);
    setNewToast(getLocal);
  }, [id]);
  // Get current page
  const { data, refetch } = useAppQuery({
    url: `/api/pages?id=${id}`,
    reactQueryOptions: {
      onSuccess: (data) => {
        setInitData(data);
        setTitle(data.title);
        setNewTitle(`Copy of ${data.title}`);
        setContent(data.body_html);
        setInitVisible(data.published_at ? ["Visable"] : ["Hidden"]);
        setSelectedVisible(data.published_at ? ["Visable"] : ["Hidden"]);
        setLoadingPage(false);
      },
      onError: (error) => {
        console.log(error);
      },
    },
  });
  useEffect(() => {
    if (title && selectedVisible.toString()) {
      setCheckSave(
        title.trim() != initData.title ||
          initVisible.toString() !== selectedVisible.toString()
          ? false
          : true
      );
    }
  }, [title, selectedVisible]);

  // Handle update page
  const handleUpdatePage = () => {
    const newData = {
      title: title,
      body_html: content,
      published: selectedVisible?.toString() !== "Visable" ? null : true,
    };
    setLoading(true);
    fetch(`/api/pages?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
    })
      .then((res) => res.json())
      .then((data) => {
        refetch();
        setLoading(false);
        setCreate("false");
        setNewToast("false");
        setToast(true);
      });
  };

  // Handle duplicate pages
  const handleDuplicatePage = () => {
    const duplicatedData = {
      title: newTitle,
      body_html: content,
      published: selectedVisible?.toString() !== "Visable" ? null : true,
    };
    fetch("/api/pages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(duplicatedData),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLoading(true);
        setDuplicate(false);
        localStorage.setItem("checkCreate", "true");
        navigate(`/page/${data.id}`);
        setLoading(false);
      });
  };
  // Handle title
  const handleTitle = useCallback((newvalue) => {
    setTitle(newvalue);
  }, []);

  // Handle visibility
  const handleChange = useCallback((value) => {
    setSelectedVisible(value);
  }, []);

  // Handle modal
  const [modal, setModal] = useState(false);
  const handleChangeModal = useCallback(() => setModal(!modal), [modal]);

  // Handle delete page
  const handleDeletePage = async () => {
    fetch(`/api/pages?id=${id}`, {
      method: "DELETE",
    }).then(() => {
      setLoading(true);
      setSelectedVisible([]);
      setTimeout(() => {
        navigate("/");
      }, 500);
    });
  };

  // Handle discard changes
  const handleDiscardChanges = () => {
    setTitle("");
    setContent("");
    setSelectedVisible(["Visable"]);
    setCheckSave(true);
  };

  // Page secondary actions
  const secondaryActionsPage = [
    {
      content: "Duplicate",
      icon: DuplicateMinor,
      accessibilityLabel: "Secondary action label",
      onAction: () => setDuplicate(true),
    },
    {
      content: "View Page",
      icon: ViewMajor,
      accessibilityLabel: "Secondary action label",
      onAction: () =>
        navigate(
          `https://quickstart-af1f2d54.myshopify.com/pages/${initData.handle}`
        ),
    },
  ];

  // Handle back action
  const backAction = () => {
    if (checkSave) {
      setCreate("false");
      setNewToast("false");
      localStorage.setItem("checkCreate", "false");
      navigate("/");
    } else setModalSave(true);
  };
  if (loadingPage) return <Skeleton />;

  return (
    <>
      {!checkSave && (
        <ContextualBar
          handleUpdatePage={handleUpdatePage}
          handleDiscardChanges={handleDiscardChanges}
          loading={loading}
        />
      )}
      {loading && (
        <div style={{ maxHeight: "1px", overflow: "hidden" }}>
          <Frame>
            <Loading />
          </Frame>
        </div>
      )}
      <ModalDuplicate
        duplicate={duplicate}
        setDuplicate={setDuplicate}
        handleDuplicate={handleDuplicatePage}
        newTitle={newTitle}
        loading={loading}
        setNewTitle={setNewTitle}
      />
      <ModalSavedPage modalSave={modalSave} setModalSave={setModalSave} />
      <Page
        backAction={{ content: initData.title, onAction: backAction }}
        title={initData.title}
        secondaryActions={secondaryActionsPage}
        pagination={{
          hasPrevious: true,
          hasNext: false,
        }}
      >
        {create === "true" && (
          <div style={{ marginBottom: "1rem" }}>
            <Banner title={`${initData.title} created`} status="success" />
          </div>
        )}
        <Modal
          open={modal}
          fullScreen={true}
          onClose={handleChangeModal}
          title={`Delete ${title}?`}
          primaryAction={{
            content: "Delete",
            destructive: true,
            onAction: handleDeletePage,
            loading: loading,
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: handleChangeModal,
            },
          ]}
        >
          <Modal.Section>
            <p>
              Delete “<strong>{title}</strong>”? This can't be undone.
            </p>
          </Modal.Section>
        </Modal>
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
                <TextEditor editorRef={editorRef} content={content} />
              </LegacyCard>
              <SearchEngine title={title} content={content} />
            </Layout.Section>
            <Layout.Section secondary>
              <LegacyCard sectioned title="Visibility">
                <ChoiceList
                  choices={[
                    { label: "Visable", value: "Visable" },
                    { label: "Hidden", value: "Hidden" },
                  ]}
                  selected={selectedVisible}
                  onChange={handleChange}
                />
              </LegacyCard>
              <OnlineStore />
            </Layout.Section>
          </Layout>
          <div style={{ padding: "20px 0px" }}>
            <Divider />
          </div>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <ButtonGroup>
              <div style={{ color: "#c5280c" }}>
                <Button monochrome outline onClick={handleChangeModal}>
                  Delete
                </Button>
              </div>
              <Button
                loading={loading}
                disabled={checkSave}
                primary
                onClick={handleUpdatePage}
              >
                Save
              </Button>
            </ButtonGroup>
          </div>
        </VerticalStack>
      </Page>
      {toast && (
        <div style={{ maxHeight: "1px", overflow: "hidden" }}>
          <Frame>
            <Toast content="Page was saved" onDismiss={() => setToast(false)} />
          </Frame>
        </div>
      )}
      {newToast === "true" && (
        <div style={{ maxHeight: "1px", overflow: "hidden" }}>
          <Frame>
            <Toast
              content="Page was created"
              onDismiss={() => setNewToast("false")}
            />
          </Frame>
        </div>
      )}
    </>
  );
};

export default EditPage;
