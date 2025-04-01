import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [securityAnswer, setSecurityAnswer] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [message, setMessage] = useState("")

  const handleResetPassword = (e) => {
    e.preventDefault()
    fetch("http://localhost:3000/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        security_answer: securityAnswer,
        new_password: newPassword
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error)
        } else {
          setMessage(data.message || "Password reset successful.")
          navigate("/signin")
        }
      })
      .catch((err) => console.error(err))
  }

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Reset Password
        </h1>
        {message && <p className="text-blue-600 mb-4 text-center">{message}</p>}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              className="border p-2 w-full rounded"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Security Answer</label>
            <input
              className="border p-2 w-full rounded"
              value={securityAnswer}
              onChange={(e) => setSecurityAnswer(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">New Password</label>
            <input
              className="border p-2 w-full rounded"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="
              bg-green-600 hover:bg-green-700 text-white 
              px-4 py-2 rounded w-full transition-colors
            "
            type="submit"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword
