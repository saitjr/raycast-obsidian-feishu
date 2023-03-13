import { Form, ActionPanel, Action, open, showToast, Toast, closeMainWindow, PopToRootType } from "@raycast/api";
import { getObsidianRoot, isNull, today } from "./utils";
import Reader from "./reader/index";
import { Obsidian } from "./obsidian";
import { useEffect, useState } from "react";

type TFormData = {
  content: string; // 内容
  tag_tips?: boolean; // TIPS 标签
  tag_readlater?: boolean; // 稍后阅读标签
  tag_todo?: boolean; // TODO 前缀
  duplicate_to_feishu?: boolean; // 是否拷贝至飞书
};

export default function Command() {
  const [form, setForm] = useState<TFormData>({
    content: "",
  });

  async function handleSubmit(form: TFormData) {
    console.log(form);
    if (isNull(form.content)) {
      showToast({ title: "Submitted form", message: "Content is empty", style: Toast.Style.Failure });
      return;
    }
    showToast({ title: "Submitted form", message: "See logs for submitted values" });

    const texts: string[] = [];
    if (form.tag_todo) {
      texts.push("TODO");
    }
    if (form.tag_tips) {
      texts.push("#TIPS");
    }
    if (form.tag_readlater) {
      texts.push("#READLATER");
    }
    texts.push(form.content);

    const ob = new Obsidian(getObsidianRoot());
    await ob.writeDailyNote(today(), texts.join(" "));

    open("raycast://confetti");
    closeMainWindow({ popToRootType: PopToRootType.Immediate });
  }

  useEffect(() => {
    async function autoCatchWebsite() {
      const reader = new Reader();
      const website = await reader.catchWebsite();
      if (isNull(website)) return;
      console.log(`update: ${JSON.stringify(website)}`);

      setForm({
        content: `[${website?.title}](${website?.url}) `,
      });
    }

    autoCatchWebsite();
  }, []);

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea id="content" title="Content" placeholder="Enter Content..." value={form.content} autoFocus />
      <Form.Checkbox id="tag_tips" title="Tags" label="#TIPS" defaultValue={true} />
      <Form.Checkbox id="tag_readlater" label="#READLATER" />
      <Form.Checkbox id="tag_todo" label="#TODO" />
      <Form.Separator />
      <Form.Checkbox id="duplicate_to_feishu" title="Duplicate" label="拷贝至个人空间" />
    </Form>
  );
}
