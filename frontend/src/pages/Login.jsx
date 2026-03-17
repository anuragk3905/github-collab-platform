import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  // 🔥 LOGIN FUNCTION
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // ✅ TEMP: simulate backend call
      console.log("Login Data:", data);

      await new Promise((res) => setTimeout(res, 1000));

      // ✅ SUCCESS TOAST
      toast.success("Login successful!");

      // ✅ NAVIGATE TO DASHBOARD
      navigate("/dashboard");

    } catch (err) {
      // ❌ ERROR TOAST
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
      
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#161b22] p-8 rounded-lg w-96 border border-gray-700"
      >
        <h2 className="text-white text-2xl mb-6 text-center font-bold">
          Sign in to GitHub
        </h2>

        {/* Email */}
        <label className="text-gray-400 text-sm">Email address</label>
        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          className="w-full mt-1 mb-3 p-2 rounded bg-[#0d1117] border border-gray-600 text-white"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}

        {/* Password */}
        <label className="text-gray-400 text-sm">Password</label>
        <input
          type="password"
          {...register("password", { required: "Password is required" })}
          className="w-full mt-1 mb-3 p-2 rounded bg-[#0d1117] border border-gray-600 text-white"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mt-4"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {/* Extra */}
        <p className="text-gray-400 text-sm mt-4 text-center">
          Don’t have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Sign up
          </span>
          
        </p>
      </form>

    </div>
  );
}