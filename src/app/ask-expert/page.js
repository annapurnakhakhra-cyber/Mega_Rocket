"use client";
import { useEffect, useState } from "react";
import { Search, RefreshCcw, Download, Mail, X } from "lucide-react";

export default function AskExpertList() {
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null); // for popup

  // Fetch Data
  const loadData = async () => {
    try {
      const res = await fetch("/api/ask-experts");
      const data = await res.json();
      setInquiries(data);
    } catch (err) {
      console.error("Failed to load inquiries", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Search filter
  const filteredData = inquiries.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.phone.toLowerCase().includes(q)
    );
  });

  // Export CSV
  const exportCSV = () => {
    const csvHeader = "Name,Email,Phone,Message,Created At\n";
    const csvRows = inquiries
      .map(
        (i) =>
          `${i.name},${i.email},${i.phone},${i.message.replace(
            /\n/g,
            " "
          )},${new Date(i.createdAt).toLocaleString()}`
      )
      .join("\n");

    const blob = new Blob([csvHeader + csvRows], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ask-expert-inquiries.csv";
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Ask an Expert Inquiry List</h1>

        <div className="flex gap-3">
          <button
            onClick={loadData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2"
          >
            <RefreshCcw size={18} /> Refresh
          </button>

          <button
            onClick={exportCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center gap-2"
          >
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      {/* Stat Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow-md rounded-xl flex items-center gap-4">
          <Mail size={40} className="text-blue-500" />
          <div>
            <p className="text-sm text-gray-600">Total Inquiries</p>
            <h2 className="text-2xl font-semibold">{inquiries.length}</h2>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white shadow-md p-4 rounded-xl flex items-center gap-3">
        <Search size={20} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by name, email, phone..."
          className="w-full outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl shadow-lg">
        <table className="w-full text-left">
          <thead className="bg-[#0D1A2D] text-white">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Message</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-600 italic">
                  No inquiries found
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 font-medium">{item.name}</td>
                  <td className="py-3 px-4">{item.email}</td>
                  <td className="py-3 px-4">{item.phone}</td>
                  <td className="py-3 px-4 truncate max-w-[250px]">
                    {item.message}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelected(item)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Details Popup */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6 relative shadow-xl">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-semibold mb-4">Inquiry Details</h2>

            <div className="space-y-3 text-gray-700">
              <p><strong>Name:</strong> {selected.name}</p>
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Phone:</strong> {selected.phone}</p>
              <p><strong>Message:</strong></p>
              <div className="p-3 bg-gray-100 rounded-lg">
                {selected.message}
              </div>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selected.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
