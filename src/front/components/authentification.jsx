import { useEffect, useState } from "react";

import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (ev) => {
    ev.preventDefault();
    setError("");

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password })
        }
      );

      if (!resp.ok) {
        const data = await resp.json();
        setError(data?.message || "Signup failed");
        return;
      }

      // Redirect or show message
      navigate("/login");  // Or auto-login
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network or server error");
    }
  };


  return (
    <div className="card">
      <form className="card-body" onSubmit={submitHandler}>
        <div className="mb-2">
          <label htmlFor="signupUser" className="form-label">
            Username:
          </label>
          <input
            id="signupUser"
            className="form-control"
            autoComplete="username"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <label htmlFor="signupEmail" className="form-label">
            Email:
          </label>
          <input
            id="signupEmail"
            type="email"
            className="form-control"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
        </div>
        <div className="mb-2">
          <label htmlFor="signupPass" className="form-label">
            Password:
          </label>
          <input
            id="signupPass"
            type="password"
            autoComplete="current-password"
            className="form-control"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required
          />
        </div>
        <div className="mb-2 d-flex flex-row justify-content-center gap-2">
          <button className="btn btn-primary">Register</button>
          <button className="btn btn-danger" type="reset">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const LoginForm = ({ afterLogin = () => null }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { dispatch } = useGlobalReducer();

  const submitHandler = async (ev) => {
    ev.preventDefault();
    setError("");

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!resp.ok) {
        const data = await resp.json();
        setError(data?.msg || "Login failed");
        return;
      }

      const data = await resp.json();

      dispatch({
        type: "login",
        payload: data,
      });

      afterLogin();
      navigate("/"); // Or redirect wherever
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed - server/network issue");
    }
  };

  return (
    <div className="card">
      <form className="card-body" onSubmit={submitHandler}>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-2">
          <label htmlFor="loginUser" className="form-label">
            Username:
          </label>
          <input
            id="loginUser"
            className="form-control"
            autoComplete="username"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
            required
          />
        </div>
        <div className="mb-2">
          <label htmlFor="loginPass" className="form-label">
            Password:
          </label>
          <input
            id="loginPass"
            type="password"
            autoComplete="current-password"
            className="form-control"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required
          />
        </div>
        <div className="mb-2 d-flex flex-row justify-content-center gap-2">
          <button className="btn btn-primary">Login</button>
          <button className="btn btn-danger" type="reset">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};



const AuthedOrNone = ({ children }) => {
  const { store } = useGlobalReducer();

  return <>
    {store.token ? children : ""}
  </>
}

const AorB = ({ authed, unauthed }) => {
  const { store } = useGlobalReducer();

  return <>
    {store.token ? authed : unauthed}
  </>
}

const AuthedOrRedirect = ({ children, to = "/" }) => {
  const { store } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.token) {
      navigate(to);
    }
  }, [store.token])

  return <>
    {store.token ? children : ""}
  </>
}

export {
  SignUpForm, LoginForm,
  AuthedOrNone, AorB,
  AuthedOrRedirect,
};