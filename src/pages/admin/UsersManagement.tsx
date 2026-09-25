import { Card, Badge } from "@/components/common/Card";
import { useAppSelector } from "@/hooks/useAppStore";

const AdminUsersManagement = () => {
  const currentUser = useAppSelector((state) => state.auth.user);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-forest-900">Users</h1>
      <p className="text-sm text-slate-500">
        Manage admin accounts and roles: SUPER_ADMIN, ADMIN, EDITOR, MODERATOR.
      </p>

      {currentUser && (
        <Card className="max-w-md">
          <p className="font-semibold text-forest-900">{currentUser.name}</p>
          <p className="text-sm text-slate-500">{currentUser.email}</p>
          <div className="mt-2">
            <Badge color="forest">{currentUser.role}</Badge>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminUsersManagement;
