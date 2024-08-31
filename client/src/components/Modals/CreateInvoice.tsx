import React, { useState } from "react";
import { Invoice } from "../../utils/types";
import Button from "../UI/Button";

const InvoiceForm = ({
  onSubmit,
}: {
  onSubmit: (invoice: Invoice) => void;
}) => {
  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: Date.now(),
      customer,
      amount: parseFloat(amount),
      date,
    });
    setCustomer("");
    setAmount("");
    setDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="customer"
          className="block text-sm font-medium text-gray-700"
        >
          Customer
        </label>
        <input
          type="text"
          id="customer"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700"
        >
          Amount
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          Date
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <Button type="submit" variant="primary" className="w-full">
        Generate Invoice
      </Button>
    </form>
  );
};

interface IProps {
  submit: (invoice: Invoice) => void;
  onClose: () => void;
}

export default function CreateInvoice({ submit, onClose }: IProps) {
  return (
    <div>
      <div className="bg-white max-w-3xl w-full rounded-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Create New Invoice
          </h2>
          <InvoiceForm onSubmit={submit} />
        </div>
      </div>
    </div>
  );
}
