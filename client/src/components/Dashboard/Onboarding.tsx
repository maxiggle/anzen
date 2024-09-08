import useForm from "../../hooks/useForm";
import config from "../../utils/config";
import { RegisterRole } from "../../utils/types";
import Button from "../UI/Button";

type IProps = {
  publicKey: string;
  onClose: () => void;
};

export default function Onboarding({ publicKey, onClose }: IProps) {
  const { form, errors, setFormValue, isSubmitting, submit } = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      publicKey: publicKey,
      role: "",
    },
    validator: (values) => {
      const errors: Record<string, string> = {};
      if (!values.firstName) errors.firstName = "First name is required";
      if (!values.lastName) errors.lastName = "Last name is required";
      if (!values.email) errors.email = "Email is required";
      if (!values.publicKey) errors.publicKey = "Public key is required";
      if (!values.role) errors.role = "Role is required";
      return errors;
    },
    action: async (values) => {
      console.log("calling action");

      const response = await fetch(`${config.backendUrl}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        alert("Registration failed");
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }
    },
    success: () => {
      alert("Registration successful!");
      onClose();
    },
  });

  return (
    <div className="flex flex-col items-center justify-center ">
      <h1 className="font-bold text-2xl bg-white px-5">
        Complete Your Profile
      </h1>
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="firstName"
          >
            First Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={setFormValue}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs italic">{errors.firstName}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="lastName"
          >
            Last Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={setFormValue}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs italic">{errors.lastName}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={setFormValue}
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic">{errors.email}</p>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="role"
          >
            Role:
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="role"
            name="role"
            value={form.role}
            onChange={setFormValue}
          >
            <option value="">Select a role</option>
            <option value={RegisterRole.Contractor}>Contractor</option>
            <option value={RegisterRole.Company}>Company</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs italic">{errors.role}</p>
          )}
        </div>
        <div className="flex items-center justify-center">
          <Button
            loading={isSubmitting}
            disabled={isSubmitting}
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </div>
      </form>
    </div>
  );
}
