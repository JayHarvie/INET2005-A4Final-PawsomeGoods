import { useForm } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const setIsLoggedIn = useOutletContext(); // Access setIsLoggedIn
  const [serverError, setServerError] = useState("");
  const apiHost = import.meta.env.VITE_API_HOST;
  const apiUrl = `${apiHost}/api/users/login`;

  async function formSubmit(data) {
    setServerError("");
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      setIsLoggedIn(true); // Set login state to true
      navigate("/Home");
    } catch (error) {
      setServerError(error.message || "An unexpected error occurred.");
    }
  }

  return (
    <div className="d-flex flex-column align-items-center vh-100">
      <h1 className="mb-4">Login</h1>
      <form onSubmit={handleSubmit(formSubmit)} className="w-25">
        {serverError && <div className="alert alert-danger">{serverError}</div>}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input {...register("email", { required: "Email is required." })} type="email" className="form-control bg-light" />
          {errors.email && <span className="text-danger">{errors.email.message}</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input {...register("password", { required: "Password is required." })} type="password" className="form-control bg-light" />
          {errors.password && <span className="text-danger">{errors.password.message}</span>}
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
        <button type="submit" className="btn btn-outline-dark ms-2" onClick={navigate("/Signup")}>Signup</button>
      </form>
    </div>
  );
}
