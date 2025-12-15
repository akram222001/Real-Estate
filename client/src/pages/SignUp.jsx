import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { API_BASE } from "../../config";
import toast, { Toaster } from "react-hot-toast";



export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const img = e.target.files[0];
    setFile(img);
    setPreview(URL.createObjectURL(img));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  if (!formData.username || !formData.email || !formData.password) {
    toast.error("Please fill all required fields");
    return;
  }

  try {
    setLoading(true);

    const bodyData = new FormData();
    bodyData.append("username", formData.username);
    bodyData.append("email", formData.email);
    bodyData.append("password", formData.password);

    if (file) {
      bodyData.append("avatar", file);
    }

    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: "POST",
      body: bodyData,
    });

    const data = await res.json();

    // ❌ FAIL CASE
    if (data.success === false) {
      setLoading(false);
      setError(data.message);
      toast.error(data.message);
      return;
    }

    // ✅ SUCCESS CASE
    setLoading(false);
    setError(null);

    toast.success("Account created successfully 🎉");

    setTimeout(() => {
      navigate("/sign-in");
    }, 1500);

  } catch (error) {
    setLoading(false);
    setError(error.message);
    toast.error("Something went wrong");
  }
};

  return (
    <div className="p-5 max-w-sm md:mx-auto mx-6 bg-white m-10 shadow-md ">
       <Toaster
        position="top-center"
        containerStyle={{
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />
      <h1 className="text-2xl text-center font-semibold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col items-center mb-1">
          <label htmlFor="avatar">
            <img
              src={
                preview ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              className="w-16 h-16 object-cover rounded-full cursor-pointer"
              alt="Avatar"
            />
          </label>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            className="hidden"
            onChange={handleImage}
          />
          <p className="text-xs text-gray-500 mt-1">Upload image (optional)</p>
        </div>
        <input
          type="text"
          placeholder="username"
          className="border p-2 rounded-lg"
          id="username"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="email"
          className="border p-2 rounded-lg"
          id="email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="password"
          className="border p-2 rounded-lg"
          id="password"
          onChange={handleChange}
          required
        />

        <button
          disabled={loading}
          className="bg-slate-700 text-white p-2 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <div className="flex items-center justify-center gap-2">
          <p>Have an account?</p>
          <Link to={"/sign-in"}>
            <span className="text-blue-700">LogIn</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <OAuth />
      </form>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
