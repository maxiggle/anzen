import { FaPlus } from "react-icons/fa";
import Alert from "../../components/UI/Alert";
import Button from "../../components/UI/Button";
import DataTable from "../../components/UI/DataTable";
import Notification from "../../components/UI/Notification";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

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

      <section className="w-full mt-8 flex md:flex-row gap-8">
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
        <div className="md:w-1/3 bg-white p-8 shadow rounded-lg">
          <h3 className="font-semibold text-xl mb-4">Loan Distribution</h3>
          <div className="w-full h-64">
            <Doughnut
              data={{
                labels: ["Paid", "Pending", "Overdue"],
                datasets: [
                  {
                    data: [300, 50, 100],
                    backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
                    hoverBackgroundColor: ["#45a049", "#e6ac00", "#da190b"],
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      color: "#333",
                      font: {
                        size: 12,
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
