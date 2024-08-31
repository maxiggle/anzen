import { FaPlus } from "react-icons/fa";
import Alert from "../../components/UI/Alert";
import Button from "../../components/UI/Button";
import DataTable from "../../components/UI/DataTable";
import Notification from "../../components/UI/Notification";

export default function Index() {
  return (
    <div>
      <header className="flex flex-row mb-6 justify-between">
        <div>
          <h2 className="font-semibold text-2xl">Hello, Godwin 👋</h2>
          <p className="text-gray-700">Here's what's going on today.</p>
        </div>
        <div>
          <Notification />
        </div>
      </header>

      <Alert type="info" className="mb-3">
        <div className="flex flex-col">
          <div className="w-full">Task Update</div>
          <p className="font-normal">You have an important task to attend to</p>
        </div>
      </Alert>

      <section className="w-full mt-3">
        <div className="md:w-2/3">
          <DataTable
            label={"Loan Transactions"}
            left={
              <div>
                <Button
                  variant="primary"
                  className="!py-2 flex flex-row gap-1 items-center"
                >
                  <FaPlus className="mr-2" />
                  Take a loan
                </Button>{" "}
              </div>
            }
            data={[
              {
                sn: 1,
                date: new Date().toLocaleDateString(),
                amount: 10000,
                status: "Paid",
              },
            ]}
            headers={["SN", "Date", "Amount", "Status"]}
          />
        </div>
        <div className="md:w-1/3"></div>
      </section>
    </div>
  );
}
