import { useForm } from "react-hook-form";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useState } from "react";

export default function Checkout() {
  const { isLoggedIn } = useOutletContext(); // Access isLoggedIn from context
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState("");
  const [cookies, setCookie] = useCookies(["cart"]);
  const navigate = useNavigate();

  const apiHost = import.meta.env.VITE_API_HOST;
  const apiUrl = `${apiHost}/api/products/purchase`;

  async function formSubmit(data) {
    setServerError("");
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          cart: cookies.cart,
        }),
        credentials: "include", // Ensure cookies (session) are included in the request
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
  
      setCookie("cart", "", { maxAge: 0 });
      navigate("/Confirmation");
    } catch (error) {
      setServerError(error.message || "An unexpected error occurred.");
    }
  }
  
  

  if (!isLoggedIn) {
    return (
      <div className="text-center mt-5">
        <p>You must be logged in to proceed with checkout.</p>
        <a href="/Login" className="btn btn-primary">Login to Continue</a>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center vh-100">
      <h1 className="mb-4">Checkout</h1>
      {serverError && <div className="alert alert-danger">{serverError}</div>}
      <form onSubmit={handleSubmit(formSubmit)} className="w-50">
        <div className="mb-3">
          <label className="form-label">Street</label>
          <input
            {...register("street", { required: "Street is required." })}
            type="text"
            className="form-control"
          />
          {errors.street && <span className="text-danger">{errors.street.message}</span>}
        </div>

        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            {...register("city", { required: "City is required." })}
            type="text"
            className="form-control"
          />
          {errors.city && <span className="text-danger">{errors.city.message}</span>}
        </div>

        <div className="mb-3">
          <label className="form-label">Province</label>
          <input
            {...register("province", { required: "Province is required." })}
            type="text"
            className="form-control"
          />
          {errors.province && <span className="text-danger">{errors.province.message}</span>}
        </div>

        <div className="mb-3">
          <label className="form-label">Country</label>
          <input
            {...register("country", { required: "Country is required." })}
            type="text"
            className="form-control"
          />
          {errors.country && <span className="text-danger">{errors.country.message}</span>}
        </div>

        <div className="mb-3">
          <label className="form-label">Postal Code</label>
          <input
            {...register("postal_code", { required: "Postal Code is required." })}
            type="text"
            className="form-control"
          />
          {errors.postal_code && <span className="text-danger">{errors.postal_code.message}</span>}
        </div>

        <div className="mb-3">
          <label className="form-label">Credit Card Number</label>
          <input
            {...register("credit_card", { required: "Credit Card Number is required." })}
            type="text"
            className="form-control"
          />
          {errors.credit_card && <span className="text-danger">{errors.credit_card.message}</span>}
        </div>

        <div className="mb-3">
          <label className="form-label">Credit Card Expiration</label>
          <input
            {...register("credit_expire", { required: "Expiration Date is required." })}
            type="text"
            placeholder="MM/YY"
            className="form-control"
          />
          {errors.credit_expire && <span className="text-danger">{errors.credit_expire.message}</span>}
        </div>

        <div className="mb-3">
          <label className="form-label">CVV</label>
          <input
            {...register("credit_cvv", { required: "CVV is required." })}
            type="text"
            className="form-control"
          />
          {errors.credit_cvv && <span className="text-danger">{errors.credit_cvv.message}</span>}
        </div>

        <button type="submit" className="btn btn-primary">Complete Purchase</button>
      </form>
    </div>
  );
}
