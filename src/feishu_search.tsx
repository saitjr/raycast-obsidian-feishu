import { Form, ActionPanel, Action, showToast, open, closeMainWindow, Toast, List } from "@raycast/api";
import { FeishuDoc, TFindItem } from "./drive";
import { Obsidian } from "./obsidian";
import { ECookieType, getObsidianRoot, today } from "./utils";
import path from "path";
import { useEffect, useState } from "react";

interface State {
  isLoading: boolean;
  items?: TFindItem[];
  error?: Error;
}

function Actions(props: { item: TFindItem }) {
  return (
    <ActionPanel title={props.item.title}>
      <ActionPanel.Section>
        {props.item.url && <Action.OpenInBrowser url={props.item.url} />}
        {props.item.title && <Action.OpenInBrowser url={props.item.title} title="Open Comments in Browser" />}
      </ActionPanel.Section>
      <ActionPanel.Section>
        {props.item.url && (
          <Action.CopyToClipboard
            content={props.item.url}
            title="Copy Link"
            shortcut={{ modifiers: ["cmd"], key: "." }}
          />
        )}
      </ActionPanel.Section>
    </ActionPanel>
  );
}

function StoryListItem(props: { item: TFindItem; index: number; search: string }) {
  console.log(props.search);
  return (
    <List.Item
      icon={props.item.icon_path}
      title={props.item.title ?? "No title"}
      subtitle={props.item.author}
      actions={<Actions item={props.item} />}
    />
  );
}

export default function Command() {
  const [state, setState] = useState<State>({
    isLoading: true,
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function search() {
      await fetchStories(searchTerm);
    }
    search();
  }, []);

  async function fetchStories(keyword: string) {
    try {
      setState({ items: state.items, isLoading: true });
      const searchResults = await new FeishuDoc(ECookieType.Chrome).find(keyword, false);
      console.log(searchResults);
      setState({ items: searchResults, isLoading: false });
    } catch (error) {
      console.log(error);
      setState({
        error: error instanceof Error ? error : new Error("Something went wrong"),
        isLoading: false,
      });
    }
  }

  async function test(value: unknown) {
    await fetchStories(value as string);
  }

  return (
    <List isLoading={state.isLoading} onSearchTextChange={test} throttle>
      {state.items?.map((item, index) => (
        <StoryListItem key={item.title} item={item} index={index} search={searchTerm} />
      ))}
    </List>
  );
}
