"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { RoleBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/empty-state";
import { TableSkeleton } from "@/components/ui/loaders";
import { Avatar } from "@/components/site/navbar";
import { useAuth } from "@/components/providers/auth-provider";
import { ApiError, apiSend } from "@/lib/api";
import { useApi } from "@/lib/use-api";
import { formatDate } from "@/lib/format";
import type { Role, SessionUser } from "@/lib/types";

const ROLES: Role[] = ["customer", "technician", "admin"];

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const params = new URLSearchParams();
  if (roleFilter) params.set("role", roleFilter);
  if (query) params.set("search", query);
  const path = `/api/admin/users${params.toString() ? `?${params.toString()}` : ""}`;

  const { data, loading, error, reload } = useApi<SessionUser[]>(path);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function changeRole(user: SessionUser, role: Role) {
    setUpdatingId(user.id);
    try {
      await apiSend(`/api/admin/users/${user.id}/role`, { role }, "PATCH");
      toast.success(`${user.name} is now a ${role}`);
      await reload();
    } catch (requestError) {
      toast.error(
        requestError instanceof ApiError ? requestError.message : "Could not change the role"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Manage users"
        description="Promote customers to technicians, or grant admin access. You cannot change your own role."
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form
          className="relative flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            setQuery(search.trim());
          }}
        >
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email…"
            className="input rounded-full py-2.5 pl-11"
            aria-label="Search users"
          />
        </form>

        <div className="flex gap-1 rounded-full border border-ink-200 bg-white p-1">
          {["", ...ROLES].map((role) => (
            <button
              key={role || "all"}
              type="button"
              onClick={() => setRoleFilter(role)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                roleFilter === role
                  ? "bg-ink-900 text-white"
                  : "text-ink-600 hover:bg-ink-100"
              }`}
            >
              {role || "All"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : !data?.length ? (
        <EmptyState icon={Users} title="No users found" description="Try a different search or role filter." />
      ) : (
        <div className="dash-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="border-b border-ink-200 bg-ink-50/80">
                <tr>
                  <th className="table-th">User</th>
                  <th className="table-th">Email</th>
                  <th className="table-th">Role</th>
                  <th className="table-th">Joined</th>
                  <th className="table-th">Change role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {data.map((user) => {
                  const isSelf = user.id === currentUser?.id;
                  return (
                    <tr key={user.id} className="hover:bg-ink-50/60">
                      <td className="table-td">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} image={user.image} />
                          <div>
                            <p className="font-semibold text-ink-900">{user.name}</p>
                            <p className="text-xs text-ink-500">{user.area ?? "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-td">{user.email}</td>
                      <td className="table-td">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="table-td text-xs text-ink-500">
                        {formatDate(user.createdAt ?? "")}
                      </td>
                      <td className="table-td">
                        <select
                          value={user.role}
                          disabled={isSelf || updatingId === user.id}
                          onChange={(event) => changeRole(user, event.target.value as Role)}
                          className="input w-32 py-1.5 text-xs capitalize disabled:cursor-not-allowed disabled:bg-ink-50"
                          aria-label={`Change role for ${user.name}`}
                        >
                          {ROLES.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                        {isSelf && (
                          <p className="mt-1 text-[10px] text-ink-400">This is you</p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
