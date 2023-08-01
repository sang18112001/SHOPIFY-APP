import {
  LegacyCard,
  ResourceList,
  ResourceItem,
  TextField,
  Text,
  Button,
  Badge,
  Modal,
} from "@shopify/polaris";
import { useState } from "react";
import { configTime, formatTimeAgo } from "../../utils";
import { useCallback } from "react";
import { useAuthenticatedFetch, useNavigate } from "@shopify/app-bridge-react";
import { EmptyStatePage } from "./EmptyPages";

function ResourceItemExample(props) {
  const { listPages, loading, setLoading, refetch } = props;
  const [selectedItems, setSelectedItems] = useState([]);
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();
  const handleChange = useCallback(() => setActive(!active), [active]);

  const activatorDelete = (
    <Button plain destructive>
      Delete Pages
    </Button>
  );

  // Hanlde delete pages
  const handleDeletePage = async () => {
    fetch(`/api/pages?id=${selectedItems.toString()}`, {
      method: "DELETE",
    }).then(() => {
      setActive(false);
      setLoading(true);
      refetch();
      setSelectedItems([]);
    });
  };

  // Handle hidden pages
  const handleHiddenPages = async () => {
    fetch(`/api/pages?id=${selectedItems.toString()}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        published: false,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setLoading(true);
        setActive(false);
        refetch();
        setSelectedItems([]);
      });
  };

  // Handle visible pages
  const handleVisiblePages = async () => {
    fetch(`/api/pages?id=${selectedItems.toString()}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        published: true,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setLoading(true);
        setActive(false);
        refetch();
        setSelectedItems([]);
      });
  };

  const bulkActions = [
    {
      content: "Make selected pages visible",
      onAction: () => handleVisiblePages(),
    },
    {
      content: "Hide selected pages",
      onAction: () => handleHiddenPages(),
    },
    {
      content: activatorDelete,
      onAction: () => handleChange(),
    },
  ];

  const renderItem = (item) => {
    const { id, url, title, author, body_html, created_at, published_at } =
      item;
    // const authorMarkup = author ? <div>by {author}</div> : null;
    const createAt = formatTimeAgo(created_at)
    return (
      <ResourceItem
        id={id}
        url={url}
        accessibilityLabel={`View details for ${title}`}
        name={title}
        onClick={() => navigate(`/page/${id}`)}
      >
        <div style={{ display: "flex", gap: "6px" }}>
          <Text as="h3" variant="bodyMd" fontWeight="semibold">
            {title}
          </Text>
          {!published_at && <Badge>Hidden</Badge>}
        </div>
        <p
          dangerouslySetInnerHTML={{ __html: body_html }}
          style={{ fontStyle: "normal!important" }}
        />
        <Text as="p">{createAt}</Text>
        {/* {authorMarkup} */}
      </ResourceItem>
    );
  };

  if (!loading && listPages.length === 0) return <EmptyStatePage />;

  return (
    <LegacyCard>
      <Modal
        open={active}
        onClose={handleChange}
        title={`Delete ${selectedItems.length} ${
          selectedItems.length === 1 ? "page" : "pages"
        }`}
        primaryAction={{
          content: "Delete",
          destructive: true,
          onAction: handleDeletePage,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: handleChange,
          },
        ]}
      >
        <Modal.Section>
          <p>
            Deleted pages cannot be recovered. Do you still want to continue?
          </p>
        </Modal.Section>
      </Modal>
      <ResourceList
        loading={loading}
        resourceName={{ singular: "page", plural: "pages" }}
        items={listPages}
        bulkActions={bulkActions}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        selectable
        renderItem={renderItem}
      />
    </LegacyCard>
  );
}

export default ResourceItemExample;
