import { FaPlus } from "react-icons/fa";
import Alert from "../../components/UI/Alert";
import Button from "../../components/UI/Button";
import DataTable from "../../components/UI/DataTable";
import Notification from "../../components/UI/Notification";

import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { useProfileStore } from "../../store/useProfileStore";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

export default function Index() {
  const user = useProfileStore((state) => state.user);
  return (
    <div>
      <header className="flex flex-row mb-6 justify-between">
        <div>
          <h2 className="font-semibold text-2xl">
            Hello, {user?.firstName} 👋
          </h2>
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
          <div className="bg-white p-8 shadow rounded-lg mb-8">
            <h3 className="font-semibold text-xl  mb-6">Invoice Statistics</h3>
            <div className="w-full h-64">
              <Line
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                  datasets: [
                    {
                      label: "Cleared Invoices",
                      data: [65, 59, 80, 81, 56, 55],
                      fill: false,
                      borderColor: "#8E24AA",
                      tension: 0.1,
                      backgroundColor: "#8E24AA",
                    },
                    {
                      label: "Uncleared Invoices",
                      data: [28, 48, 40, 19, 86, 27],
                      fill: false,
                      borderColor: "#3949AB",
                      tension: 0.1,
                      backgroundColor: "#3949AB",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
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
          <h3 className="font-semibold text-xl text-center mb-6">
            Contracts Statistics
          </h3>
          <div className="w-full h-64">
            <Doughnut
              data={{
                labels: ["Signed", "Reviewed", "Rejected"],
                datasets: [
                  {
                    data: [300, 50, 100],
                    backgroundColor: ["#8E24AA", "#5E35B1", "#3949AB"],
                    hoverBackgroundColor: ["#6A1B9A", "#4527A0", "#283593"],
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
