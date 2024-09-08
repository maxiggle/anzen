import { useState } from "react";
import Button from "../../components/UI/Button";
import Modal from "../../components/UI/Modal";
import DataTable from "../../components/UI/DataTable";
import { Invoice, RegisterRole } from "../../utils/types";
import CreateInvoice from "../../components/Modals/CreateInvoice";
import { CompanyPayment } from "../../components/Dashboard/Payment/CompanyPayment";
import { useProfileStore } from "../../store/useProfileStore";

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const user = useProfileStore((state) => state.user);

  return (
    <div className="">
      <div className="">
        {user?.role === RegisterRole.Company && <CompanyPayment />}
        {user?.role === RegisterRole.Contractor && (
          <>
            <div className="flex flex-col items-center min-h-[calc(100vh-100px)] justify-center ">
              <h1 className="text-4xl font-bold mb-4 text-gray-800">
                Coming Soon
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We're working hard to bring you something amazing!
              </p>
              <div className="w-24 h-24 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
              <p className="mt-8 text-sm text-gray-500">
                Stay tuned for updates
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
