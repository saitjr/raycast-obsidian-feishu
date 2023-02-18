import { Form, ActionPanel, Action, open, showToast, Toast } from "@raycast/api";
import { getObsidianRoot, isNull, today } from "./utils";
import { Obsidian } from "./obsidian";

type TFormData = {
  content: string; // 内容
  mood: string;
};

export default function Command() {
  async function handleSubmit(form: TFormData) {
    console.log(form);
    if (isNull(form.content)) {
      showToast({ title: "Submitted form", message: "Content is empty", style: Toast.Style.Failure });
      return;
    }
    showToast({ title: "Submitted form", message: "Success" });

    const texts: string[] = [];
    texts.push(`#MOOD_${form.mood}`);
    const hour = today().hour();
    const hourStr = hour < 10 ? `0${hour}` : `${hour}`;
    texts.push(`#HOUR_${hourStr}`);
    texts.push(form.content);
    const ob = new Obsidian(getObsidianRoot());
    await ob.writeDailyNote(today(), texts.join(" "));
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea id="content" title="Content" placeholder="肿么了..." autoFocus />
      <Form.Dropdown id="mood" title="Mood">
        <Form.Dropdown.Item value="🥳" title="🥳" />
        <Form.Dropdown.Item value="😭" title="😭" />
        <Form.Dropdown.Item value="😤" title="😤" />
        <Form.Dropdown.Item value="😔" title="😔" />
      </Form.Dropdown>
    </Form>
  );
}
