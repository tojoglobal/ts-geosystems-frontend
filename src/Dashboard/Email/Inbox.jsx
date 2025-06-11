import React, { useState, useEffect } from "react";
import InboxSidebar from "./InboxSidebar";
import EmailList from "./EmailList";
import MailView from "./MailView";
import ComposeModal from "./ComposeModal";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const FOLDERS = [
  { key: "inbox", label: "Inbox" },
  { key: "starred", label: "Starred" },
  { key: "important", label: "Important" },
  { key: "draft", label: "Draft" },
  { key: "sent", label: "Sent Mail" },
  { key: "trash", label: "Trash" },
];

const Inbox = ({ userEmail }) => {
  const axiosPublicUrl = useAxiospublic();
  const [emails, setEmails] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [currentFolder, setCurrentFolder] = useState("inbox");

  useEffect(() => {
    fetchFolder(currentFolder);
    // eslint-disable-next-line
  }, [userEmail, currentFolder]);

  const fetchFolder = async (folder) => {
    let endpoint = `/api/emails/${folder}/${userEmail}`;
    if (folder === "sent") endpoint = `/api/emails/sent/${userEmail}`;
    const res = await axiosPublicUrl.get(endpoint);
    setEmails(Array.isArray(res.data) ? res.data : []);
  };

  const filtered = emails.filter(
    (mail) =>
      mail.subject?.toLowerCase().includes(search.toLowerCase()) ||
      mail.sender?.toLowerCase().includes(search.toLowerCase()) ||
      mail.body?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-tr from-neutral-900 via-gray-900 to-blue-950 text-gray-100">
      <InboxSidebar
        emails={emails}
        onCompose={() => setShowCompose(true)}
        userEmail={userEmail}
        folders={FOLDERS}
        onSelectFolder={setCurrentFolder}
        currentFolder={currentFolder}
      />
      <main className="flex-1 p-8">
        <div className="flex items-center gap-4 mb-6">
          <input
            className="w-full border border-gray-700 bg-neutral-900 text-gray-100 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-700"
            placeholder="Search mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="p-2 rounded hover:bg-gray-800 text-blue-400">
            <i className="fa fa-archive" />
          </button>
          <button className="p-2 rounded hover:bg-gray-800 text-red-400">
            <i className="fa fa-trash" />
          </button>
        </div>
        <EmailList
          emails={filtered}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        {selectedId && (
          <MailView
            id={selectedId}
            userEmail={userEmail}
            onClose={() => setSelectedId(null)}
            onSent={() => {
              setSelectedId(null);
              fetchFolder(currentFolder);
            }}
          />
        )}
        {showCompose && (
          <ComposeModal
            onClose={() => setShowCompose(false)}
            onSent={() => {
              setShowCompose(false);
              fetchFolder(currentFolder);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default Inbox;
