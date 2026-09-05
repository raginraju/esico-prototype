// src/pages/Users.tsx
import { useState } from "react";
import { Users as UsersIcon } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";

interface UserItem {
  id: string;
  name: string;
  mobile: string;
  email: string;
  status: "Pending" | "Active" | "Inactive";
}

const INITIAL_USERS: UserItem[] = [
  { id: "1", name: "Osama El Fayoumy", mobile: "0596842937", email: "osama@smart-const.com", status: "Pending" },
  { id: "2", name: "Abdul", mobile: "0561915348", email: "qaduchacha1@outlook.com", status: "Pending" },
  { id: "3", name: "Umair", mobile: "0591165191", email: "umairyaqoobnagra@gmail.com", status: "Pending" },
  { id: "4", name: "SvvblsSWVculorkxzFu", mobile: "5786049391", email: "i.tiq.uhip.a.y.uw.91@gmail.com", status: "Pending" },
  { id: "5", name: "ZDzBlqhYNurMzNkwzjh", mobile: "9079533524", email: "o.tin.o.n.eca.z.o697@gmail.com", status: "Pending" },
  { id: "6", name: "Muhammad Bilal", mobile: "0544582808", email: "muhammadbilal5556788@gmail.com", status: "Pending" },
  { id: "7", name: "MUHAMMED AJMAL", mobile: "0567493661", email: "ajmalak5205@gmail.com", status: "Pending" },
  { id: "8", name: "Malik Najeeb", mobile: "0580713314", email: "maliknajeeb1124@gmail.com", status: "Pending" },
  { id: "9", name: "Manni Fathi Gubara", mobile: "0537031614", email: "Moanifm@gmail.com", status: "Pending" },
  { id: "10", name: "Tet", mobile: "1234567890", email: "gh@gmail.com", status: "Pending" },
];

export default function Users() {
  const [users] = useState<UserItem[]>(INITIAL_USERS);

  return (
    <>
      <PageHeader
        title="Users"
        icon={<UsersIcon className="w-5 h-5" />}
        actionButton={{
          label: "Add New",
          onClick: () => alert("Add New User"),
        }}
      />

      {/* White Table Card */}
      <div className="bg-white rounded-[4px] shadow-[0_0_10px_rgba(0,0,0,0.03)] border border-[#ebedf2] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#ebedf2] text-[13px] font-semibold text-[#343a40]">
                <th className="py-3.5 px-6 font-semibold">Name</th>
                <th className="py-3.5 px-6 font-semibold">Mobile</th>
                <th className="py-3.5 px-6 font-semibold">Email</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebedf2] text-[13px]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="py-3.5 px-6 text-[#343a40] font-normal whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="py-3.5 px-6 text-[#6c757d] whitespace-nowrap">
                    {user.mobile}
                  </td>
                  <td className="py-3.5 px-6 text-[#6c757d] whitespace-nowrap">
                    {user.email}
                  </td>
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <span className="inline-block bg-[#fed713] text-white text-[11px] font-semibold px-3 py-1 rounded-[3px] shadow-xs">
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-[#ebedf2] flex items-center justify-end gap-3 text-[12px] text-[#6c757d]">
          <span>1 - 10 of 31 Entries</span>

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
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>

          <button
            className="w-7 h-7 flex items-center justify-center border border-[#ced4da] rounded-[2px] bg-white text-[#495057] hover:bg-[#f8f9fa] cursor-pointer"
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      </div>
    </>
  );
}