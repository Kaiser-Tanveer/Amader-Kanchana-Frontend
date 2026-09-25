import { Routes, Route } from "react-router-dom";
import PublicLayout from "@/components/layout/PublicLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

import Home from "@/pages/public/Home";
import About from "@/pages/public/About";
import VisionMission from "@/pages/public/VisionMission";
import Activities from "@/pages/public/Activities";
import NewsDetail from "@/pages/public/NewsDetail";
import Projects from "@/pages/public/Projects";
import ProjectDetail from "@/pages/public/ProjectDetail";
import Community from "@/pages/public/Community";
import CommunityMap from "@/pages/public/CommunityMap";
import Wards from "@/pages/public/Wards";
import WardDetail from "@/pages/public/WardDetail";
import Institutions from "@/pages/public/Institutions";
import Issues from "@/pages/public/Issues";
import IssueDetail from "@/pages/public/IssueDetail";
import ReportProblem from "@/pages/public/ReportProblem";
import Volunteer from "@/pages/public/Volunteer";
import Gallery from "@/pages/public/Gallery";
import Contact from "@/pages/public/Contact";
import Privacy from "@/pages/public/Privacy";
import Terms from "@/pages/public/Terms";
import NotFound from "@/pages/public/NotFound";

import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminIssuesManagement from "@/pages/admin/IssuesManagement";
import AdminProjectsManagement from "@/pages/admin/ProjectsManagement";
import AdminActivitiesManagement from "@/pages/admin/ActivitiesManagement";
import AdminGalleryManagement from "@/pages/admin/GalleryManagement";
import AdminWardsManagement from "@/pages/admin/WardsManagement";
import AdminInstitutionsManagement from "@/pages/admin/InstitutionsManagement";
import AdminVolunteersManagement from "@/pages/admin/VolunteersManagement";
import AdminUsersManagement from "@/pages/admin/UsersManagement";
import AdminSettings from "@/pages/admin/Settings";

function App() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/vision-mission" element={<VisionMission />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/map" element={<CommunityMap />} />
        <Route path="/community/wards" element={<Wards />} />
        <Route path="/community/wards/:wardId" element={<WardDetail />} />
        <Route path="/community/institutions" element={<Institutions />} />
        <Route path="/issues" element={<Issues />} />
        <Route path="/issues/:id" element={<IssueDetail />} />
        <Route path="/report-problem" element={<ReportProblem />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/news" element={<Activities />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="issues" element={<AdminIssuesManagement />} />
        <Route path="projects" element={<AdminProjectsManagement />} />
        <Route path="activities" element={<AdminActivitiesManagement />} />
        <Route path="gallery" element={<AdminGalleryManagement />} />
        <Route path="wards" element={<AdminWardsManagement />} />
        <Route path="institutions" element={<AdminInstitutionsManagement />} />
        <Route path="volunteers" element={<AdminVolunteersManagement />} />
        <Route path="users" element={<AdminUsersManagement />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
