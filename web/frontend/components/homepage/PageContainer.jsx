import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  LegacyCard,
  Tabs,
  TextField,
  Icon,
  LegacyStack,
  Layout,
  Button,
  LegacyTabs,
  Tag,
  Popover,
  ChoiceList,
  ActionList,
} from "@shopify/polaris";
import { SearchMinor, StarFilledMinor } from "@shopify/polaris-icons";
import ResourceItemExample from "./ShowPages";
import SortHome from "./SortHome";
import { useAppQuery } from "../../hooks";
import { getLocalFilters, sortPages } from "../../utils";
import { BoxSavedFilters } from "./SavedFilters";

const initSelectedTab = {
  id: "id_all",
  content: "All",
};

const localFilter = getLocalFilters();
const listFilter = localFilter.map((filter) => {
  return { id: filter.title, content: filter.title };
});
const initTabs = [initSelectedTab].concat(listFilter);

const PageContainer = () => {
  const [query, setQuery] = useState("");
  const [tagName, setTagName] = useState("");
  const [loading, setLoading] = useState(true);
  const [listPages, setListPages] = useState([]);
  const [tabs, setTabs] = useState(initTabs);
  const [typeSort, setTypeSort] = useState("new");
  const [tabSelected, setTabSelected] = useState(0);
  const [visibleStatus, setVisibleStatus] = useState(null);
  const inputRef = useRef(null);

  // Handle reder pages
  const { refetch } = useAppQuery({
    url: `/api/pages?published_status=${visibleStatus}`,
    reactQueryOptions: {
      onSuccess: (data) => {
        setLoading(false);
        const newLocalFilter = getLocalFilters();
        const newListFilter = newLocalFilter.map((filter) => {
          return { id: filter.title, content: filter.title };
        });
        const tabsTitle = tabs.map((tab) => tab.content);
        if (
          newLocalFilter.length > 0 &&
          !tabsTitle.includes(newListFilter.slice(-1)[0].content)
        ) {
          setTabs((prev) => [prev[0]].concat(newListFilter));
          setTabSelected(tabs.length);
          setVisibleStatus(newListFilter.slice(-1)[0].visibleStatus);
        }
        let newPages;
        if (query === "" && visibleStatus === null) {
          setTabSelected(0);
          setTabs((prev) => [prev[0]].concat(newListFilter));
          newPages = [...data.data];
        } else {
          newPages = data.data.filter((page) =>
            page.title.toLowerCase().includes(query.toLowerCase())
          );
        }
        if (typeSort) {
          newPages = sortPages(newPages, typeSort);
        }
        setListPages(newPages);
      },
      onError: (error) => {
        console.log(error);
      },
    },
  });
  // Handle input query
  const handleInputQuery = useCallback(
    (newValue) => {
      const input = inputRef.current.querySelector("input")
      setQuery(newValue);
      setLoading(true);
      const findSearchTab = tabs.find((tab) => tab.id === "id_search_tab");
      if (!newValue) {
        setTabs(initTabs);
        setTabSelected(0);
      } else if (!findSearchTab && newValue) {
        const newTab = {
          id: "id_search_tab",
          content: "Custom search",
        };
        const newTabs = [...tabs, newTab];
        setTabs(newTabs);
        setTabSelected(newTabs.length - 1);
        
      }
      input.focus();
      refetch();
    },
    [query]
  );

  // Handle tabs
  const handleTabChange = useCallback((selectedTabIndex) => {
    setTabSelected(selectedTabIndex);
    if (selectedTabIndex === 0) {
      setQuery("");
      setLoading(true);
    } else {
      const selectedTab = localFilter[selectedTabIndex - 1];
      setQuery(selectedTab?.query || "");
      setVisibleStatus(selectedTab?.visibleStatus);
      setLoading(true);
    }
    refetch();
  }, []);

  // Handle filter changes
  const [popoverFilter, setPopoverFilter] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState([]);
  const choicesFilter = [
    { label: "Visible", value: "published" },
    { label: "Hidden", value: "unpublished" },
  ];
  const togglePopoverFilter = useCallback(
    () => setPopoverFilter((prev) => !prev),
    []
  );
  const filterActivator = (
    <Button onClick={togglePopoverFilter} disclosure>
      Visibility
    </Button>
  );
  const handleChoiceList = useCallback((value) => {
    setSelectedChoice(value);
    setVisibleStatus(value);
    setLoading(true);
    setTagName((prev) => (value[0] === "published" ? "Visible" : "Hidden"));
  }, []);

  // Handle Save
  const [popoverActive, setSaveBox] = useState(false);
  const togglePopoverActive = useCallback(
    () => setSaveBox((prev) => !prev),
    []
  );
  const saveActivator = (
    <Button
      disabled={!query && selectedChoice.length === 0}
      icon={<Icon source={StarFilledMinor} />}
      onClick={togglePopoverActive}
    >
      Saved
    </Button>
  );

  // Handle remove
  const clearFilter = useCallback((tag) => {
    setTagName("");
    setVisibleStatus(null);
    setSelectedChoice([]);
    setLoading(true);
    refetch();
  }, []);

  return (
    <LegacyCard>
      <LegacyTabs tabs={tabs} selected={tabSelected} onSelect={handleTabChange}>
        <LegacyCard.Section>
          <Layout>
            <Layout.Section>
              <LegacyStack spacing="tight" fullWidth>
                <LegacyStack.Item fill>
                  <div ref={inputRef}>
                    <TextField
                      prefix={<Icon source={SearchMinor} color="base" />}
                      fullWidth
                      value={query}
                      placeholder="Filter Pages"
                      onChange={handleInputQuery}
                    />
                  </div>
                </LegacyStack.Item>
                <LegacyStack.Item>
                  <Popover
                    active={popoverFilter}
                    activator={filterActivator}
                    onClose={togglePopoverFilter}
                    ariaHaspopup={false}
                    sectioned
                  >
                    <ChoiceList
                      choices={choicesFilter}
                      selected={selectedChoice}
                      onChange={handleChoiceList}
                    />
                    <p
                      className={`clearFilter ${
                        visibleStatus && "activeClearFilter"
                      }`}
                      onClick={clearFilter}
                    >
                      Clear
                    </p>
                  </Popover>
                </LegacyStack.Item>
                <LegacyStack.Item>
                  <Popover
                    active={popoverActive}
                    activator={saveActivator}
                    autofocusTarget="first-node"
                    onClose={togglePopoverActive}
                  >
                    <BoxSavedFilters
                      tagName={tagName}
                      visibleStatus={visibleStatus}
                      query={query}
                      refetch={refetch}
                      togglePopoverActive={togglePopoverActive}
                    />
                  </Popover>
                </LegacyStack.Item>
                <LegacyStack.Item>
                  <SortHome
                    setLoading={setLoading}
                    refetch={refetch}
                    setTypeSort={setTypeSort}
                    typeSort={typeSort}
                  />
                </LegacyStack.Item>
              </LegacyStack>
              {tagName && (
                <div style={{ marginTop: "0.5rem" }}>
                  <Tag onRemove={clearFilter}>Visibility is {tagName}</Tag>
                </div>
              )}
            </Layout.Section>
          </Layout>
        </LegacyCard.Section>
      </LegacyTabs>
      <ResourceItemExample
        listPages={listPages}
        loading={loading}
        setLoading={setLoading}
        refetch={refetch}
      />
    </LegacyCard>
  );
};

export default PageContainer;
