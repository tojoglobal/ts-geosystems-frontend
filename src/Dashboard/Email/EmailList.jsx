import EmailItem from "./EmailItem";

const EmailList = ({ emails, selectedId, onSelect }) => (
  <div className="bg-white rounded shadow min-h-[400px]">
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
