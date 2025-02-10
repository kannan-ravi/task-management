import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import {
  FaBold,
  FaItalic,
  FaList,
  FaListOl,
  FaStrikethrough,
} from "react-icons/fa";
import { useState } from "react";

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="py-3">
      <div className="flex items-center">
        <div className="flex items-center gap-2 pe-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-gray-200 p-1" : "p-1"}
          >
            <FaBold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-gray-200 p-1" : "p-1"}
          >
            <FaItalic />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "bg-gray-200 p-1" : "p-1"}
          >
            <FaStrikethrough />
          </button>
        </div>
        <div className="flex items-center gap-2 ps-2 border-s border-gray-400">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={
              editor.isActive("bulletList") ? "bg-gray-200 p-1" : "p-1"
            }
          >
            <FaList />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={
              editor.isActive("orderedList") ? "bg-gray-200 p-1" : "p-1"
            }
          >
            <FaListOl />
          </button>
        </div>
      </div>
    </div>
  );
};

type TiptapProps = {
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
};

export default function Tiptap({ description, setDescription }: TiptapProps) {
  const [characterCount, setCharacterCount] = useState<number>(0);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Type here",
      }),
      CharacterCount.configure({
        limit: 300,
      }),
    ],
    content: description,
    onUpdate: ({ editor }) => {
      setCharacterCount(editor.getText().length);
      if (editor.getText().length < 300) {
        setDescription(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        spellcheck: "false",
        class:
          "h-32 border border-gray-300 p-3 overflow-auto outline-0 border-0 lg:h-28",
      },
    },
  });

  return (
    <div className="flex flex-col">
      <div className="border border-gray-300 mt-2 rounded-md shadow-md">
        <EditorContent editor={editor} className="h-32 overflow-auto" />
        <div className="flex items-center justify-between px-3">
          <MenuBar editor={editor} />
          <div className="text-right text-sm text-gray-400">
            {editor && characterCount}/300 characters
          </div>
        </div>
      </div>
    </div>
  );
}
