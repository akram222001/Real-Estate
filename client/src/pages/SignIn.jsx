import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import { API_BASE } from "../../config";
import toast, { Toaster } from "react-hot-toast";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());

      const res = await fetch(`${API_BASE}/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // ❌ FAIL CASE
      if (data.success === false) {
        dispatch(signInFailure(data.message));

        // toast error
        toast.error(data.message || "Login failed");

        return;
      }

      // ✅ SUCCESS CASE
      dispatch(signInSuccess(data));
      toast.success("Login successful 🎉");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-5 max-w-sm md:mx-auto mx-6 bg-white m-10 shadow-md">
      <Toaster
        position="top-center"
        containerStyle={{
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />

      <h1 className="text-3xl text-center font-semibold my-6">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-2 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <div className="flex gap-2 justify-center items-center">
          <p>Dont have an account?</p>
          <Link to={"/sign-up"}>
            <span className="text-blue-700">SignUp</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <OAuth />
      </form>
    </div>
  );
}
