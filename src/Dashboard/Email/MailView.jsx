/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ComposeModal from "./ComposeModal";
import { useAxiospublic } from "../../Hooks/useAxiospublic";

const MailView = ({ id, userEmail, onClose, onSent }) => {
  const axiosPublicUrl = useAxiospublic();
  const [mail, setMail] = useState(null);
  const [showReply, setShowReply] = useState(false);

  useEffect(() => {
    axiosPublicUrl.get(`/api/emails/${id}`).then((res) => setMail(res.data));
  }, [id]);

  if (!mail) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
      <div className="bg-neutral-900 text-gray-100 rounded shadow-xl w-full max-w-lg p-8 relative border border-gray-700">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-400"
          onClick={onClose}
        >
          ×
        </button>
        <div className="mb-6">
          <div className="mb-2">
            <span className="font-bold text-gray-200">From: </span>
            {mail.sender}
          </div>
          <div className="mb-2">
            <span className="font-bold text-gray-200">To: </span>
            {mail.recipient}
          </div>
          <div className="mb-2">
            <span className="font-bold text-gray-200">Subject: </span>
            {mail.subject}
          </div>
          <div className="text-gray-300 whitespace-pre-line mt-4">
            {mail.body}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            onClick={() => setShowReply(true)}
          >
            Reply
          </button>
          <button
            className="bg-gray-800 text-gray-200 px-4 py-2 rounded hover:bg-gray-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        {showReply && (
          <ComposeModal
            userEmail={userEmail}
            onClose={() => setShowReply(false)}
            onSent={() => {
              setShowReply(false);
              if (onSent) onSent();
            }}
            initialData={{
              recipient: mail.sender,
              subject: "Re: " + mail.subject,
              body: "",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MailView;
