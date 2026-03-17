import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // ✅ SUCCESS ONLY
    toast.success("Account created successfully!");

    // redirect to login
    navigate("/");
  };

  const password = watch("password");

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0d1117] text-white">
      
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-[#161b22] p-8 rounded-lg w-96 border border-gray-700"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        {/* Username */}
        <label className="text-gray-400 text-sm">Username</label>
        <input
          type="text"
          {...register("username", {
            required: "Username is required",
          })}
          className="w-full mt-1 mb-1 p-2 bg-[#0d1117] border border-gray-600 rounded"
        />
        {errors.username && (
          <p className="text-red-500 text-sm mb-2">
            {errors.username.message}
          </p>
        )}

        {/* Email */}
        <label className="text-gray-400 text-sm">Email</label>
        <input
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email format",
            },
          })}
          className="w-full mt-1 mb-1 p-2 bg-[#0d1117] border border-gray-600 rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">
            {errors.email.message}
          </p>
        )}

        {/* Password */}
        <label className="text-gray-400 text-sm">Password</label>
        <input
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Minimum 6 characters required",
            },
          })}
          className="w-full mt-1 mb-1 p-2 bg-[#0d1117] border border-gray-600 rounded"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">
            {errors.password.message}
          </p>
        )}

        {/* Confirm Password */}
        <label className="text-gray-400 text-sm">Confirm Password</label>
        <input
          type="password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === password || "Passwords do not match",
          })}
          className="w-full mt-1 mb-1 p-2 bg-[#0d1117] border border-gray-600 rounded"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-3">
            {errors.confirmPassword.message}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 py-2 rounded hover:bg-green-700 mt-2"
        >
          Register
        </button>

      </form>
    </div>
  );
}