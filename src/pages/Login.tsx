import { useState } from "react";
import { login } from "../services/auth";
import { saveToken } from "../services/token";
import { useNavigate } from "react-router-dom";
import { search } from "../services/search";
import { findMyUserId, getMyUserIdFromToken } from "../services/user";
// import { getMyUserId } from "../services/user";
// import { findMyUserIdStable } from "../services/user";


export default function Login() {
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleLogin = async () => {
    try {
      const res = await login({
        login: loginInput,
        password,
      });


      console.log(res); 

      saveToken(res.token);

      localStorage.setItem("user_id", String(res.id_user));

      // localStorage.removeItem("user_id");


      // const myId = await getMyUserIdFromToken();

      // console.log("FOUND USER ID:", myId)

      // if (myId) {
      //   localStorage.setItem("user_id", String(myId));
      // }

      // localStorage.setItem("user_id", String(res.id_user));

      navigate("/");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Login error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex gap-10">

        {/* LEFT */}
        <div className="max-w-sm">
          <h1 className="text-blue-600 text-5xl font-bold mb-4">
            facebook
          </h1>
          <p className="text-lg">
            Connect with friends and the world around you.
          </p>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 shadow rounded w-80">
          <input
            placeholder="Login"
            className="border p-2 w-full mb-2"
            onChange={(e) => setLoginInput(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full mb-3"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white w-full py-2 rounded mb-2 hover:bg-blue-700"
          >
            Log In
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600"
          >
            Create new account
          </button>
        </div>

      </div>
    </div>
  );
}
