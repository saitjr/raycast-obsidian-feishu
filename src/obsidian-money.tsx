import { Form, ActionPanel, Action, open, showToast, Toast } from "@raycast/api";
import { getObsidianRoot, isNull, today } from "./utils";
import { Obsidian } from "./obsidian";

type TFormData = {
  how_much: string;
  content: string; // 内容
  type: string;
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
    texts.push(`#MONEY`);
    texts.push(`#${form.type}`);
    texts.push(`¥${form.how_much}`);
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
      <Form.TextField id="how_much" title="How Much" placeholder="多少钱" autoFocus />
      <Form.TextArea id="content" title="Content" placeholder="怎么又花钱了" />
      <Form.Dropdown id="type" title="Type">
        <Form.Dropdown.Item value="餐饮" title="🧋 餐饮" />
        <Form.Dropdown.Item value="交通" title="🚗 交通" />
        <Form.Dropdown.Item value="养狗" title="🐶 养狗" />
        <Form.Dropdown.Item value="旅游" title="🏖️ 旅游" />
        <Form.Dropdown.Item value="住房" title="🏠 住房" />
        <Form.Dropdown.Item value="日用" title="日用" />
      </Form.Dropdown>
    </Form>
  );
}
