import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

function SignUp() {
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [unitNumber, setUnitNumber] = useState("")
  const [streetName, setStreetName] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [error, setError] = useState("")
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")  
  const [state, setState] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    
    if (!username.trim()) { 
      setError("Username is required")
      return;
    };
    if(!password.trim()) {
      setError("Email is required")
      return;
    }
    if(!firstName.trim()) {
      setError("Firstname is required")
      return;
    }
    if(!lastName.trim()) {
      setError("Lastname is required")
      return;
    }
    if(!password.trim()) {
      setError("Password is required")
      return;
    }
    if(!email.trim()) {
      setError("Email is required")
      return;
    }
    if(!streetName.trim()) {
      setError("Steetname is required")
      return;
    }
    if(!city.trim()) {
      setError("City is required")
      return;
    }

    if(!country.trim()) {
      setError("Country is required")
      return;
    }
    
    if(!postalCode.trim()) {
      setError("Postal Code is required")
      return;
    }
    if(!question.trim()) {
      setError("Question is required")
      return;
    }

    if(!answer.trim()) {
      setError("Answer is required")
      return;
    }

    const payload = {
      username,
      password,
      email,
      firstName,
      lastName,
      unitNumber,
      street: streetName,
      city,
      country,
      state,
      postal_code: postalCode,
      security_question: question,
      security_answer: answer
    }

    fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Sign Up failed because of a server error!")
        return res.json()
      })
      .then((data) => {
        console.log("User created:", data)
        navigate("/signin")
      })
      .catch((err) => {
        console.error(err)
        setError("Sign Up failed. Please try another email/username.")
      })
  }

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <br/>
          <h2 className = "text-xl font-bold">User Information</h2>
          <div>
            <label className="block mb-1">Username</label>
            <input
              className="border p-2 w-full rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          </div>
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
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block mb-1">First Name</label>
              <input
                className="border p-2 w-full rounded"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1">Last Name</label>
              <input
                className="border p-2 w-full rounded"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <br/>
          <h2 className = "text-xl font-bold">Shipping Address</h2>
          <div>
            <label className="block mb-1">Unit Number</label>
            <input
              className="border p-2 w-full rounded"
              value={unitNumber}
              onChange={(e) => setUnitNumber(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1">Street Name</label>
            <input
              className="border p-2 w-full rounded"
              value={streetName}
              onChange={(e) => setStreetName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">City</label>
            <input
              className="border p-2 w-full rounded"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">State/Province</label>
            <input
              className="border p-2 w-full rounded"
          
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Country</label>
            <input
              className="border p-2 w-full rounded"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Postal Code</label>
            <input
              className="border p-2 w-full rounded"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>
          <h2 className = "text-xl font-bold">Security Information</h2>
          <div>
            <label className="block mb-1">Security Question</label>
            <input
              className="border p-2 w-full rounded"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Security Answer</label>
            <input
              className="border p-2 w-full rounded"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
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
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignUp
