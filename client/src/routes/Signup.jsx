import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Signup() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(""); // For displaying server-side error messages

  // Form submit function
  async function formSubmit(data) {
    setServerError(""); // Clear previous errors
    try {
      const response = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      // On successful signup, navigate to login page
      navigate("/login");
    } catch (error) {
      setServerError(error.message || "An unexpected error occurred.");
    }
  }

  return (
    <div className="d-flex flex-column align-items-center vh-100">
      <h1 className="mb-4">Signup</h1>
      <form onSubmit={handleSubmit(formSubmit)} method="post" className="w-25">
        {serverError && <div className="alert alert-danger">{serverError}</div>}
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input {...register("first_name", { required: "First Name is required." })} type="text" className="form-control bg-light"/>
          {errors.first_name && <span className="text-danger">{errors.first_name.message}</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input {...register("last_name", { required: "Last Name is required." })} type="text" className="form-control bg-light"/>
          {errors.last_name && <span className="text-danger">{errors.last_name.message}</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Email (username)</label>
          <input {...register("email", { required: "Email is required." })} type="email" className="form-control bg-light"/>
          {errors.email && <span className="text-danger">{errors.email.message}</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input {...register("password", { required: "Password is required." })} type="password" className="form-control bg-light"/>
          {errors.password && <span className="text-danger">{errors.password.message}</span>}
        </div>
        <button type="submit" className="btn btn-primary">Signup</button>
        <button type="button" onClick={() => navigate("/login")} className="btn btn-outline-dark ms-2">Cancel</button>
      </form>
    </div>
  );
}
