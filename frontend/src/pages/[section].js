import { useRouter } from "next/router";
import ProtectedRoute from "../../components/ProtectedRoute";
import Dashboard from "../../components/Section/Dashboard/Dashboard";

const SectionPage = () => {
  const router = useRouter();
  const { section } = router.query;

  let Component;
  let allowedRoles = [];

  switch (section) {
    case "dashboard":
      Component = Dashboard;
      allowedRoles = [0, 1, 2];
      break;
    default:
      return null;
  }

  // return <ProtectedRoute component={Component} roles={allowedRoles} />;
  return <Component />;
};

export default SectionPage;
