const labelMap = {
  freelance: "bg-yellow-900 text-yellow-200",
  support: "bg-blue-900 text-blue-200",
  social: "bg-green-900 text-green-200",
  family: "bg-green-800 text-green-100",
};

const EmailItem = ({ mail, selected, onClick }) => (
  <tr
    className={`cursor-pointer border-b border-gray-800
      hover:bg-gray-800 ${selected ? "bg-blue-900" : ""}`}
    onClick={onClick}
  >
    <td className="px-4 py-3">
      <img
        src={mail.avatar || "/default-avatar.png"}
        alt={mail.sender}
        className="w-8 h-8 rounded-full"
      />
    </td>
    <td className="px-2 py-3 font-semibold text-gray-100">{mail.sender}</td>
    <td className="px-2 py-3">
      {mail.labels?.map((label) => (
        <span
          key={label}
          className={`text-xs font-bold px-2 rounded mr-1 ${
            labelMap[label] || "bg-gray-800 text-gray-300"
          }`}
        >
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </span>
      ))}
      <span className="ml-1">{mail.subject}</span>
    </td>
    <td className="px-2 py-3 text-gray-400 truncate max-w-xs">
      {mail.body.slice(0, 60)}...
    </td>
    <td className="px-2 py-3 text-right text-gray-500">
      {mail.created_at ? new Date(mail.created_at).toLocaleDateString() : ""}
    </td>
  </tr>
);

export default EmailItem;
