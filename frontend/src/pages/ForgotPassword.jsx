import React, { useState } from "react"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [securityQuestion, setSecurityQuestion] = useState("")
  const [securityAnswer, setSecurityAnswer] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [step, setStep] = useState(1)

  const handleRequestReset = (e) => {
    e.preventDefault()
    fetch("/api/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.security_question) {
          setSecurityQuestion(data.security_question)
          setStep(2)
        } else {
          setMessage(
            data.message ||
              "If your email is registered, you'll receive the security question."
          )
        }
      })
      .catch((err) => console.error(err))
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        security_answer: securityAnswer,
        new_password: newPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error)
        } else {
          setMessage(data.message || "Password reset successful.")
        }
      })
      .catch((err) => console.error(err))
  }

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Forgot Password
        </h1>
        {message && <p className="text-blue-600 mb-4 text-center">{message}</p>}

        {step === 1 && (
          <form onSubmit={handleRequestReset} className="space-y-4">
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
            <button
              className="
                bg-blue-600 hover:bg-blue-700 text-white 
                px-4 py-2 rounded w-full transition-colors
              "
              type="submit"
            >
              Request Reset
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <p className="font-semibold text-center mb-4">
              Security Question: {securityQuestion}
            </p>
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
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
