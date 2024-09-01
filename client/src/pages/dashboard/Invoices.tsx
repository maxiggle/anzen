import { useState } from "react";
import Button from "../../components/UI/Button";
import Modal from "../../components/UI/Modal";
import DataTable from "../../components/UI/DataTable";
import { Invoice } from "../../utils/types";
import CreateInvoice from "../../components/Modals/CreateInvoice";

export default function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [show, setShow] = useState(false);

  const handleAddInvoice = (invoice: Invoice) => {
    setInvoices([...invoices, invoice]);
    setShow(false);
  };

  return (
    <div className="">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-lg font-semibold">Invoices</h2>
        <div>
          <Button onClick={() => setShow(true)} variant="primary">
            Generate Invoice
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <DataTable
          label={"Generated Invoices"}
          data={invoices.map((invoice, index) => ({
            sn: index + 1,
            customer: invoice.customer,
            amount: `$${invoice.amount.toFixed(2)}`,
            date: invoice.date,
          }))}
          headers={["SN", "Customer", "Amount", "Date"]}
        />
      </div>

      <Modal state={show} size="3xl" setState={setShow}>
        <CreateInvoice
          submit={handleAddInvoice}
          onClose={() => setShow(false)}
        />
      </Modal>
    </div>
  );
}
