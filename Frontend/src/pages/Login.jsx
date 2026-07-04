import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const inputClass = "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const labelClass = "block mb-2 font-medium text-gray-800 dark:text-gray-200";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex justify-center items-center px-4">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          Smart Expense Tracker
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Welcome back
        </p>

        {error && (
          <div className="bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-200 border border-red-200 dark:border-red-800 p-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className={inputClass}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <div className="flex items-center my-7">
          <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
          <span className="px-4 text-gray-500 dark:text-gray-400">OR</span>
          <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 py-3 rounded-lg font-semibold transition"
        >
          Continue with Google
        </button>

        <p className="text-center mt-7 text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
