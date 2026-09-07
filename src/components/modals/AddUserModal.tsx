import { useEffect, useState } from "react";
import { authHeaders } from "../../lib/utils";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Pending");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setMobile("");
      setEmail("");
      setPassword("");
      setStatus("Pending");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Name, email, and password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ name, mobile, email, password, status }),
      });
      const body = await response.json();

      if (!response.ok || body.status === "error") {
        throw new Error(body.message || "Failed to add user.");
      }

      onSuccess();
      onClose();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to add user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="add-user-title">
        <h2 id="add-user-title" className="mb-5 text-lg font-semibold text-[#343a40]">Add New User</h2>

        {error && <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input id="user-name" label="Name" value={name} onChange={(event) => setName(event.target.value)} required />
          <Input id="user-mobile" label="Mobile" value={mobile} onChange={(event) => setMobile(event.target.value)} />
          <Input id="user-email" label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Input id="user-password" label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <label htmlFor="user-status" className="block text-[13px] font-bold text-[#22242a]">Status</label>
          <select id="user-status" value={status} onChange={(event) => setStatus(event.target.value)} className="w-full rounded-[2px] border border-[#e8eaf0] bg-white px-3.5 py-3 text-[14px] text-[#22242a] focus:outline-none focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400">
            <option value="Pending">Pending</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add User"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}