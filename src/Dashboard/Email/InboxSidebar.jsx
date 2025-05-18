import React from "react";

const labels = [
  { name: "Theme Support", color: "blue" },
  { name: "Freelance", color: "yellow" },
  { name: "Social", color: "green" },
];

const chats = [
  { name: "Scott Median", avatar: "/avatar1.png", last: "Hello" },
  {
    name: "Julian Rosa",
    avatar: "/avatar2.png",
    last: "What about our next...",
  },
];

const folderIcons = {
  inbox: "fa fa-inbox",
  starred: "fa fa-star",
  important: "fa fa-exclamation-circle",
  draft: "fa fa-pencil",
  sent: "fa fa-paper-plane",
  trash: "fa fa-trash",
};

const InboxSidebar = ({
  emails,
  onCompose,
  folders,
  onSelectFolder,
  currentFolder,
}) => (
  <aside className="w-80 bg-white border-r shadow-lg p-4 flex flex-col">
    <button
      className="bg-gradient-to-r from-red-500 to-orange-500 text-white w-full py-3 rounded-lg mb-8 font-semibold shadow hover:scale-105 transition"
      onClick={onCompose}
    >
      <i className="fa fa-plus mr-2" />
      Compose
    </button>
    <nav>
      <ul className="space-y-3 font-semibold text-lg">
        {folders.map((folder) => (
          <li
            key={folder.key}
            className={`flex items-center cursor-pointer px-3 py-2 rounded-lg ${
              currentFolder === folder.key
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => onSelectFolder(folder.key)}
          >
            <i className={`${folderIcons[folder.key]} mr-3`} />
            <span>{folder.label}</span>
            <span className="ml-auto text-xs font-bold">
              {folder.key === "inbox" ? emails.length : ""}
            </span>
          </li>
        ))}
      </ul>
      <section className="mt-10">
        <h4 className="text-gray-500 mb-2 font-bold text-xs">Labels</h4>
        <ul className="space-y-2 text-sm">
          {labels.map((label) => (
            <li key={label.name} className="flex items-center gap-2">
              <span
                className={`inline-block w-3 h-3 rounded-full bg-${label.color}-500`}
              />
              {label.name}
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-10">
        <h4 className="text-gray-500 mb-2 font-bold text-xs">Chat</h4>
        <ul className="space-y-3">
          {chats.map((chat) => (
            <li key={chat.name} className="flex items-center gap-3">
              <img
                src={chat.avatar}
                alt={chat.name}
                className="w-9 h-9 rounded-full border border-gray-200"
              />
              <span className="flex flex-col">
                <span className="font-semibold">{chat.name}</span>
                <span className="text-xs text-gray-400">{chat.last}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </nav>
  </aside>
);

export default InboxSidebar;
