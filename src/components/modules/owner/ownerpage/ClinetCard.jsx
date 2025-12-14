function ClientCard({ client, onOpen }) {
  const getStatus = (s) => {
    const cfg = {
      PENDING: { txt: "در انتظار", cls: "bg-yellow-100 text-yellow-800" },
      CONFIRMED: { txt: "تایید شده", cls: "bg-green-100 text-green-800" },
      CANCELLED: { txt: "لغو شده", cls: "bg-red-100 text-red-800" },
      COMPLETED: { txt: "تکمیل شده", cls: "bg-blue-100 text-blue-800" },
    };
    return cfg[s] || { txt: s, cls: "bg-gray-100 text-gray-800" };
  };

  const st = getStatus(client.status);
  return (
    <article
      onClick={() => onOpen(client)}
      className="rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
    >
      <div className="flex justify-between items-start gap-3">
        <div>
          <h4 className="font-semibold">{client.fullName}</h4>
          <p className="text-xs text-gray-500 mt-1">{client.phone}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${st.cls}`}>
          {st.txt}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 space-y-1">
        <div>
          <strong className="text-gray-700">تور:</strong> {client.title || "هیچ عنوانی تعیین نشده"}
        </div>
      </div>
    </article>
  );
}

export default ClientCard;
