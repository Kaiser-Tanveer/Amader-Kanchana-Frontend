import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/common/Card";
import { LoadingSpinner, ErrorState } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchDashboardStats } from "@/services/resourceServices";

const COLORS = ["#2c8256", "#2f71b0", "#f59e0b", "#dc2626", "#7c3aed", "#0ea5e9"];

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <Card>
    <p className="text-sm text-slate-500">{label}</p>
    <p className="mt-1 text-3xl font-extrabold text-forest-800">{value}</p>
  </Card>
);

const AdminDashboard = () => {
  const { data, loading, error } = useFetch(() => fetchDashboardStats(), []);

  if (loading) return <LoadingSpinner />;
  if (error || !data) return <ErrorState />;

  const stats = data.data;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-forest-900">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Issues" value={stats.totalIssues} />
        <StatCard label="Verified" value={stats.verifiedIssues} />
        <StatCard label="In Progress" value={stats.inProgressIssues} />
        <StatCard label="Resolved" value={stats.resolvedIssues} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="mb-4 font-semibold text-slate-700">Issues by Ward</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.issuesByWard}>
              <XAxis dataKey="ward" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#2c8256" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <p className="mb-4 font-semibold text-slate-700">Issues by Category</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={stats.issuesByCategory}
                dataKey="count"
                nameKey="category"
                outerRadius={90}
                label={({ category }) => category}
              >
                {stats.issuesByCategory.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <p className="mb-4 font-semibold text-slate-700">Issues by Status</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stats.issuesByStatus} layout="vertical">
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="status" tick={{ fontSize: 11 }} width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#2f71b0" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <p className="mb-4 font-semibold text-slate-700">Monthly Trend</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.monthlyTrend}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2c8256" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
