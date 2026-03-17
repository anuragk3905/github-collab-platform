import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 🔥 handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.username || !user.email || !user.password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/users/register", user);

      console.log(res.data);

      alert("Account created successfully ✅");

      // 🔥 redirect to login
      navigate("/login");

    } catch (err) {
      console.log(err);
      setError("Registration failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0d1117] text-white">
      
      <form
        onSubmit={handleSubmit}
        className="bg-[#161b22] p-8 rounded-lg w-96 border border-gray-700"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        {/* Error */}
        {error && (
          <p className="text-red-500 mb-3 text-sm">{error}</p>
        )}

        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={user.username}
          onChange={handleChange}
          className="w-full mb-3 p-2 bg-[#0d1117] border border-gray-600 rounded"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 bg-[#0d1117] border border-gray-600 rounded"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 bg-[#0d1117] border border-gray-600 rounded"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        {/* Link to login */}
        <p className="text-gray-400 text-sm mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400">
            Login
          </Link>
        </p>

      </form>
    </div>
  );
}