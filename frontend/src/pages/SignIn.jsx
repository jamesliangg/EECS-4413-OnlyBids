import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useUser } from "@/context/UserContext" 

function SignIn() {
  const { setUserID } = useUser();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    if(!email.trim() || !password.trim()) {
      setError("Email or Password is empty");
      return;
    }
    fetch("http://localhost:3000/api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Sign In failed!")
        return res.json()
      })
      .then((data) => {
        console.log("Signed in:", data)
        setUserID(data.user.user_id);
        navigate("/catalogue")
      })
      .catch((err) => {
        console.error(err)
        setError("Invalid email or password.")
      })
  }

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              className="border p-2 w-full rounded"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input
              className="border p-2 w-full rounded"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline text-sm"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            className="
              bg-blue-600 hover:bg-blue-700 text-white 
              px-4 py-2 rounded w-full transition-colors
            "
            type="submit"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignIn
