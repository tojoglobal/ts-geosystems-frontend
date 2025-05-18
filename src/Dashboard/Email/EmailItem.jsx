const labelMap = {
  freelance: "bg-yellow-100 text-yellow-800",
  support: "bg-blue-100 text-blue-800",
  social: "bg-green-100 text-green-800",
  family: "bg-green-50 text-green-700",
};

const EmailItem = ({ mail, selected, onClick }) => (
  <tr
    className={`cursor-pointer hover:bg-gray-100 border-b ${
      selected ? "bg-blue-50" : ""
    }`}
    onClick={onClick}
  >
    <td className="px-4 py-3">
      <img
        src={mail.avatar || "/default-avatar.png"}
        alt={mail.sender}
        className="w-8 h-8 rounded-full"
      />
    </td>
    <td className="px-2 py-3 font-semibold">{mail.sender}</td>
    <td className="px-2 py-3">
      {mail.labels?.map((label) => (
        <span
          key={label}
          className={`text-xs font-bold px-2 rounded mr-1 ${
            labelMap[label] || "bg-gray-100 text-gray-600"
          }`}
        >
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </span>
      ))}
      {mail.subject}
    </td>
    <td className="px-2 py-3 text-gray-500 truncate max-w-xs">
      {mail.body.slice(0, 60)}...
    </td>
    <td className="px-2 py-3 text-right text-gray-400">
      {mail.created_at ? new Date(mail.created_at).toLocaleDateString() : ""}
    </td>
  </tr>
);

export default EmailItem;
