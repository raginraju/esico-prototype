// src/pages/IDCards.tsx
import { useState } from "react";
import { CreditCard } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";

interface IDCardItem {
  id: string;
  name: string;
  fileNumber: string;
  civilId: string;
  designation: string;
  expiryDate: string;
}

const INITIAL_ID_CARDS: IDCardItem[] = [
  {
    id: "1",
    name: "Jay Prakash",
    fileNumber: "ES-FN-8941",
    civilId: "2410984521",
    designation: "Lifting Equipment Inspector",
    expiryDate: "2027-01-14",
  },
  {
    id: "2",
    name: "Osama El Fayoumy",
    fileNumber: "ES-FN-8942",
    civilId: "2398471120",
    designation: "Heavy Equipment Operator",
    expiryDate: "2027-01-31",
  },
  {
    id: "3",
    name: "Abdul Rahman",
    fileNumber: "ES-FN-8943",
    civilId: "2445102938",
    designation: "Scaffolding Inspector",
    expiryDate: "2026-08-09",
  },
  {
    id: "4",
    name: "Umair Nagra",
    fileNumber: "ES-FN-8944",
    civilId: "2501928471",
    designation: "Rigging Supervisor",
    expiryDate: "2027-03-11",
  },
  {
    id: "5",
    name: "Muhammad Bilal",
    fileNumber: "ES-FN-8945",
    civilId: "2389104823",
    designation: "NDT Level II Inspector",
    expiryDate: "2027-04-04",
  },
  {
    id: "6",
    name: "MUHAMMED AJMAL",
    fileNumber: "ES-FN-8946",
    civilId: "2498172635",
    designation: "Forklift Operator",
    expiryDate: "2027-05-17",
  },
  {
    id: "7",
    name: "Malik Najeeb",
    fileNumber: "ES-FN-8947",
    civilId: "2410982341",
    designation: "Crane Operator",
    expiryDate: "2026-11-19",
  },
  {
    id: "8",
    name: "Manni Fathi Gubara",
    fileNumber: "ES-FN-8948",
    civilId: "2376192847",
    designation: "Lifting Supervisor",
    expiryDate: "2027-06-01",
  },
  {
    id: "9",
    name: "Tariq Al-Harbi",
    fileNumber: "ES-FN-8949",
    civilId: "1098273645",
    designation: "Earth Moving Operator",
    expiryDate: "2026-07-13",
  },
  {
    id: "10",
    name: "Sultan Khan",
    fileNumber: "ES-FN-8950",
    civilId: "2487612984",
    designation: "Safety Officer",
    expiryDate: "2027-06-30",
  },
];

export default function IDCards() {
  const [cards] = useState<IDCardItem[]>(INITIAL_ID_CARDS);

  return (
    <>
      <PageHeader
        title="ID Cards"
        icon={<CreditCard className="w-5 h-5" />}
        actionButton={{
          label: "Add New",
          onClick: () => alert("Add New ID Card"),
        }}
      />

      {/* White Table Card */}
      <div className="bg-white rounded-[4px] shadow-[0_0_10px_rgba(0,0,0,0.03)] border border-[#ebedf2] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#ebedf2] text-[13px] font-semibold text-[#343a40]">
                <th className="py-3.5 px-6 font-semibold">Name</th>
                <th className="py-3.5 px-6 font-semibold">File Number</th>
                <th className="py-3.5 px-6 font-semibold">Civil ID</th>
                <th className="py-3.5 px-6 font-semibold">Designation</th>
                <th className="py-3.5 px-6 font-semibold">Expiry Date</th>
                <th className="py-3.5 px-6 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebedf2] text-[13px]">
              {cards.map((card) => (
                <tr key={card.id} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="py-3.5 px-6 text-[#343a40] font-normal whitespace-nowrap">
                    {card.name}
                  </td>
                  <td className="py-3.5 px-6 text-[#6c757d] whitespace-nowrap">
                    {card.fileNumber}
                  </td>
                  <td className="py-3.5 px-6 text-[#6c757d] whitespace-nowrap">
                    {card.civilId}
                  </td>
                  <td className="py-3.5 px-6 text-[#6c757d] whitespace-nowrap">
                    {card.designation}
                  </td>
                  <td className="py-3.5 px-6 text-[#6c757d] whitespace-nowrap">
                    {card.expiryDate}
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap">
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
                        onClick={() => alert(`Delete ${card.name}`)}
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-[#ebedf2] flex items-center justify-end gap-3 text-[12px] text-[#6c757d]">
          <span>1 - 10 of 10 Entries</span>

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
    </>
  );
}