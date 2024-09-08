import { useState } from "react";
import Modal from "../../components/UI/Modal";
import { useProfileStore } from "../../store/useProfileStore";
import { clsx } from "../../utils";
import { RegisterRole } from "../../utils/types";

export default function Settings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useProfileStore((state) => state.user);

  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="bg-white shadow border rounded-xl p-6">
        <h2 className="text-2xl flex items-center justify-between gap-3 font-semibold mb-4">
          Profile Details{" "}
          <span
            className={clsx([
              "rounded-md font-thin px-4 py-1 text-base  capitalize",
              user?.role === RegisterRole.Company &&
                "bg-blue-800/50 text-white",
              user?.role === RegisterRole.Contractor &&
                "bg-amber-700/50 text-white",
            ])}
          >
            {user?.role}
          </span>
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">First Name:</p>
            <p>{user?.firstName}</p>
          </div>
          <div>
            <p className="font-medium">Last Name:</p>
            <p>{user?.lastName}</p>
          </div>
          <div>
            <p className="font-medium">Email:</p>
            <p>{user?.email}</p>
          </div>
          <div>
            <p className="font-medium">Public Key:</p>
            <p className="truncate">{user?.publicKey}</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Update Profile
        </button>
      </div>

      <Modal state={isModalOpen} setState={setIsModalOpen} size="md">
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={user?.firstName}
                onChange={(e) =>
                  setUser({ ...user, firstName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={user?.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={user?.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
