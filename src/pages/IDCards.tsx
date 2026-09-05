// src/pages/IDCards.tsx
import { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import AddIdCardModal from "../components/modals/AddIdCardModal";

interface IDCardItem {
  id: string;
  name: string;
  file_number: string;
  civil_id_number: string;
  designation: string;
  expiry_date: string;
  file_url?: string | null;
}

export default function IDCards() {
  const [cards, setCards] = useState<IDCardItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/idcards");
      const json = await res.json();
      if (json.status === "success") {
        setCards(json.data);
      }
    } catch (err) {
      console.error("Failed to load ID cards:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await fetch(`/api/idcards/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.status === "success") {
        setCards((prev) => prev.filter((card) => card.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete ID card:", err);
    }
  };

  return (
    <>
      <PageHeader
        title="ID Cards"
        icon={<CreditCard className="w-5 h-5" />}
        actionButton={{
          label: "Add New",
          onClick: () => setIsModalOpen(true),
        }}
      />

      <div className="bg-white rounded-[4px] shadow-[0_0_10px_rgba(0,0,0,0.03)] border border-[#ebedf2] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#ebedf2] text-[13px] font-semibold text-[#343a40]">
                <th className="py-3.5 px-4 md:px-6 font-semibold">Name</th>
                <th className="py-3.5 px-4 md:px-6 font-semibold">File Number</th>
                <th className="hidden md:table-cell py-3.5 px-6 font-semibold">Civil ID</th>
                <th className="hidden md:table-cell py-3.5 px-6 font-semibold">Designation</th>
                <th className="hidden md:table-cell py-3.5 px-6 font-semibold">Expiry Date</th>
                <th className="py-3.5 px-4 md:px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebedf2] text-[13px]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#6c757d]">
                    Loading ID cards...
                  </td>
                </tr>
              ) : cards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#6c757d]">
                    No ID cards found. Click "Add New" to create one.
                  </td>
                </tr>
              ) : (
                cards.map((card) => (
                  <tr key={card.id} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="py-3.5 px-4 md:px-6 text-[#343a40] font-normal whitespace-nowrap">
                      {card.name}
                    </td>
                    <td className="py-3.5 px-4 md:px-6 text-[#6c757d] whitespace-nowrap">
                      {card.file_number}
                    </td>
                    <td className="hidden md:table-cell py-3.5 px-6 text-[#6c757d] whitespace-nowrap">
                      {card.civil_id_number}
                    </td>
                    <td className="hidden md:table-cell py-3.5 px-6 text-[#6c757d] whitespace-nowrap">
                      {card.designation}
                    </td>
                    <td className="hidden md:table-cell py-3.5 px-6 text-[#6c757d] whitespace-nowrap">
                      {card.expiry_date}
                    </td>
                    <td className="py-3.5 px-4 md:px-6 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-3 text-[#212529]">
                        <button
                          onClick={() => alert(`Edit ${card.name}`)}
                          className="p-1 hover:text-[#b66dff] transition-colors cursor-pointer"
                          title="Edit"
                          aria-label="Edit"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(card.id, card.name)}
                          className="p-1 hover:text-[#fe7c96] transition-colors cursor-pointer"
                          title="Delete"
                          aria-label="Delete"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 md:px-6 py-4 border-t border-[#ebedf2] flex items-center justify-between md:justify-end gap-3 text-[12px] text-[#6c757d]">
          <span>
            {cards.length > 0 ? `1 - ${cards.length} of ${cards.length} Entries` : "0 Entries"}
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled
              className="w-7 h-7 flex items-center justify-center border border-[#ced4da] rounded-[2px] bg-white text-[#ced4da] cursor-not-allowed"
              aria-label="Previous page"
            >
              ‹
            </button>

            <select
              defaultValue="1"
              className="h-7 px-2 border border-[#ced4da] rounded-[2px] bg-white text-[#495057] text-[12px] focus:outline-none focus:border-[#b66dff]"
            >
              <option value="1">1</option>
            </select>

            <button
              disabled
              className="w-7 h-7 flex items-center justify-center border border-[#ced4da] rounded-[2px] bg-white text-[#ced4da] cursor-not-allowed"
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <AddIdCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCards}
      />
    </>
  );
}