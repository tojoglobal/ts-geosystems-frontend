import EmailItem from "./EmailItem";

const EmailList = ({ emails, selectedId, onSelect }) => (
  <div className="text-gray-100 rounded shadow min-h-[400px] border border-gray-800">
    <table className="min-w-full">
      <tbody>
        {emails.map((mail) => (
          <EmailItem
            key={mail.id}
            mail={mail}
            selected={selectedId === mail.id}
            onClick={() => onSelect(mail.id)}
          />
        ))}
      </tbody>
    </table>
  </div>
);

export default EmailList;
