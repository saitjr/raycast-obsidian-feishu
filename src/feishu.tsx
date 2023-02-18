import { Form, ActionPanel, Action, showToast, open } from "@raycast/api";
import { FeishuDoc } from "./drive";
import { Obsidian } from "./obsidian";
import { ECookieType, getObsidianRoot, today } from "./utils";
import path from "path";

type TValues = {
  // title: string;
  cookieType: ECookieType;
  // createFeishuDoc: boolean;
};

export default function Command() {
  async function handleSubmit(values: TValues) {
    console.log(values);
    showToast({ title: "Submitted form", message: "See logs for submitted values" });

    const feishuURL = await new FeishuDoc(values.cookieType).create("");
    open(feishuURL);
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      {/* <Form.Description text="This form showcases all available form elements." /> */}
      {/* <Form.TextField id="title" title="Title" placeholder="Enter doc title" defaultValue="Untitled" /> */}
      {/* <Form.Separator /> */}
      {/* <Form.DatePicker id="datepicker" title="Date picker" /> */}
      {/* <Form.Checkbox id="createFeishuDoc" title="Create Feishu Doc" label="Create Feishu Doc" storeValue /> */}
      <Form.Dropdown id="cookieType" title="Cookie Type">
        <Form.Dropdown.Item value="chrome" title="Chrome" />
        <Form.Dropdown.Item value="safari" title="Safari" />
      </Form.Dropdown>
      {/* <Form.TagPicker id="tokeneditor" title="Tag picker">
        <Form.TagPicker.Item value="tagpicker-item" title="Tag Picker Item" />
      </Form.TagPicker> */}
    </Form>
  );
}
