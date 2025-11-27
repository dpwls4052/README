import { Suspense } from "react";
import AdminContent from "@/components/admin/AdminContent";

const Admin = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminContent />
    </Suspense>
  );
};

export default Admin;
