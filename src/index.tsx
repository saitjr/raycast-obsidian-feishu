import { Form, ActionPanel, Action, showToast } from "@raycast/api";
import { FeishuDoc } from "./drive";
import { ECookieType } from "./utils"

type TValues = {
  title: string;
  cookieType: ECookieType
};

export default function Command() {
  async function handleSubmit(values: TValues) {
    console.log(values);
    showToast({ title: "Submitted form", message: "See logs for submitted values" });

    console.log('23423423')

    const data = await new FeishuDoc(ECookieType.Chrome).find('test')
    console.log(data)


    // await 
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
      <Form.TextField id="title" title="Title" placeholder="Enter doc title" defaultValue="Untitled" />
      {/* <Form.Separator /> */}
      {/* <Form.DatePicker id="datepicker" title="Date picker" /> */}
      {/* <Form.Checkbox id="checkbox" title="Checkbox" label="Checkbox Label" storeValue /> */}
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
