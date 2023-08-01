import { useNavigate } from "@shopify/app-bridge-react";
import { Page } from "@shopify/polaris";
import { HomeWarning } from "../components/homepage/HomeWarning";
import PageContainer from "../components/homepage/PageContainer";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Page
      fullWidth
      title="Pages"
      primaryAction={{
        content: "Add Page",
        onAction: () => navigate("/page/new"),
      }}
    >
      <HomeWarning />
      <PageContainer />
    </Page>
  );
}
