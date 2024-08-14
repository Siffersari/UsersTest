import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/userService";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password);
      navigate("/users");
    } catch (err) {
      setError("Invalid username or password");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-kcbLightGray">
      <div className="bg-kcbWhite p-8 rounded-lg shadow-md max-w-sm w-full">
        <h2 className="text-2xl font-semibold text-kcbDarkBlue mb-6 text-center">
          Login to KCB
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-kcbDarkBlue font-medium mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-kcbDarkBlue rounded focus:outline-none focus:ring-2 focus:ring-kcbTeal"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-kcbDarkBlue font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-kcbDarkBlue rounded focus:outline-none focus:ring-2 focus:ring-kcbTeal"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className={`w-full bg-kcbGreen text-white py-2 rounded hover:bg-kcbTeal transition-colors duration-200 flex justify-center items-center ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-b-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
            )}
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
