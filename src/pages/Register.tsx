import { useState } from "react";
import { register } from "../services/auth";
import { saveToken } from "../services/token";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    login: "",
    email: "",
    password: "",
    repeat_password: "",
  });

  const handleRegister = async () => {
    try {
      const res = await register(form);

      saveToken(res.token);
      navigate("/");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow rounded p-6 w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Create account
        </h1>

        <input
          placeholder="Login"
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setForm({ ...form, login: e.target.value })
          }
        />

        <input
          placeholder="Email"
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Repeat Password"
          className="border p-2 w-full mb-4"
          onChange={(e) =>
            setForm({
              ...form,
              repeat_password: e.target.value,
            })
          }
        />

        <button
          onClick={handleRegister}
          className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
