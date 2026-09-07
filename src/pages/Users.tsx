// src/pages/Users.tsx
import { useEffect, useState } from "react";
import { Users as UsersIcon } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { authHeaders } from "../lib/utils";
import AddUserModal from "../components/modals/AddUserModal";

interface UserItem {
  id: string;
  name: string;
  mobile: string;
  email: string;
  status: "Pending" | "Active" | "Inactive";
}

export default function Users() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const loadUsers = async () => {
      try {
        setLoading(true);
        const headers = authHeaders();
        const response = await fetch("/api/users?page=1&limit=10", Object.keys(headers).length ? { headers } : undefined);
        const body = await response.json();
        if (body.status === "success") {
          setUsers(body.data);
          setTotal(body.pagination.total);
        }
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  return (
    <>
      <PageHeader
        title="Users"
        icon={<UsersIcon className="w-5 h-5" />}
        actionButton={{
          label: "Add New",
          onClick: () => setIsAddUserOpen(true),
        }}
      />

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onSuccess={() => void loadUsers()}
      />

      {/* White Table Card */}
      <div className="bg-white rounded-[4px] shadow-[0_0_10px_rgba(0,0,0,0.03)] border border-[#ebedf2] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#ebedf2] text-[13px] font-semibold text-[#343a40]">
                <th className="py-3.5 px-4 md:px-6 font-semibold">Name</th>
                <th className="hidden md:table-cell py-3.5 px-6 font-semibold">Mobile</th>
                <th className="hidden md:table-cell py-3.5 px-6 font-semibold">Email</th>
                <th className="py-3.5 px-4 md:px-6 font-semibold text-right md:text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebedf2] text-[13px]">
              {loading ? (
                <tr><td colSpan={4} className="py-8 text-center text-[#6c757d]">Loading users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="py-8 text-center text-[#6c757d]">No users found.</td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="py-3.5 px-4 md:px-6 text-[#343a40] font-normal whitespace-nowrap">
                    {user.name}
                  </td>
                  <td className="hidden md:table-cell py-3.5 px-6 text-[#6c757d] whitespace-nowrap">
                    {user.mobile}
                  </td>
                  <td className="hidden md:table-cell py-3.5 px-6 text-[#6c757d] whitespace-nowrap">
                    {user.email}
                  </td>
                  <td className="py-3.5 px-4 md:px-6 whitespace-nowrap text-right md:text-left">
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
        <div className="px-4 md:px-6 py-4 border-t border-[#ebedf2] flex items-center justify-between md:justify-end gap-3 text-[12px] text-[#6c757d]">
          <span>{total === 0 ? "0 Entries" : `1 - ${users.length} of ${total} Entries`}</span>

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
      </div>
    </>
  );
}