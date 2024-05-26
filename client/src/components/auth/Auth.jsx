import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import auth from "../../config/firebase-config";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
} from "firebase/auth";
import { ClockLoader, BarLoader, PuffLoader } from "react-spinners";
import { toast } from "sonner";
import logo from "../../assets/google.svg";
import { createSession } from "../../services/auth.js";
import welcomeImage from "../../assets/welcome_image.jpg";
function Auth() {
  const [authState, setAuthState] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState({ active: false, type: "" });
  const toggleAuthState = () => setAuthState(!authState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuthAction = async (e) => {
    e.preventDefault();
    if (authState) await handleSignUp();
    else await handleSignIn();
  };

  const handleSignIn = async () => {
    try {
      setLoading({ active: true, type: "email" });
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user.emailVerified) {
        dispatch(
          login({
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          })
        );
        setLoading({ active: false, type: "" });
        const { idToken } = result._tokenResponse;
        const sessionCreated = await createSession(idToken);
        if (!sessionCreated) {
          toast.error("Something went wrong! Please try again");
        }
      } else {
        toast.warning("Please verify your email before signing in");
      }
    } catch (error) {
      console.error("Error signing in with email and password:", error);
      toast.error("Something went wrong! Please try again");
    } finally {
      setLoading({ active: false, type: "" });
    }
  };

  const handleSignUp = async () => {
    const signUpPromise = createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        return sendEmailVerification(userCredential.user);
      })
      .then(() => {
        setAuthState(false);
        setEmail("");
        setPassword("");
        toast.info("Check your email to verify your account.");
      })
      .catch((error) => {
        console.error(error);
      });

    toast.promise(
      signUpPromise,
      {
        loading: "Sending verification email...",
        error: "Error while signing up. Please try again.",
      },
      {
        style: {
          minWidth: "200px",
        },
        success: {
          duration: 6500,
        },
      }
    );
  };

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setLoading({ active: true, type: "google" });
      if (result.user.emailVerified) {
        dispatch(
          login({
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          })
        );
        const { idToken } = result._tokenResponse;
        const sessionCreated = await createSession(idToken);
        if (sessionCreated) {
          navigate("/home");
        } else {
          console.error("Failed to create session!");
          // Potential logout or reattempt session creation
          return;
        }
      } else {
        toast.warning("Something went wrong! Please try again.");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading({ active: false, type: "" });
    }
  };

  if (loading.active) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <PuffLoader size={150} color={"#123abc"} />
      </div>
    );
  }

  return (
    <div className="font-roboto flex items-center justify-center h-screen bg-blue-300 p-8 mx-auto">
      <div className="bg-white rounded-xl shadow-md p-4 md:w-3/4 w-full max-w-4xl mx-auto flex">
        <div className="hidden lg:flex w-1/2 items-center justify-center rounded-l-xl">
          <img
            src={welcomeImage}
            alt="Welcome"
            className="w-full h-auto rounded-l-xl"
          />
        </div>
        <div className="w-full lg:w-1/2 p-3">
          <div className="text-center">
            <div className="text-slate-800 text-3xl sm:text-3xl md:text-4xl font-bold mt-5 mb-6">
              {authState ? "Create an account" : "Welcome back"}
            </div>
            <form onSubmit={handleAuthAction} className="space-y-7 my-4">
              <div className="flex flex-col items-center my-1">
                <input
                  id="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="block w-5/6 sm:w-3/5 px-3 py-2 my-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="block w-5/6 sm:w-3/5 px-3 py-2 my-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-5/6 sm:w-3/5 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded "
              >
                <div className="flex justify-center items-center">
                  <div>
                    {loading.active && loading.type === "email" ? (
                      <ClockLoader color="#FFFFFF" size={15} />
                    ) : (
                      "Continue"
                    )}
                  </div>
                </div>
              </button>
              <p
                className="text-gray-600 cursor-pointer text-xs sm:text-sm"
                onClick={() => {
                  toggleAuthState();
                  setEmail("");
                  setPassword("");
                }}
              >
                {authState ? (
                  <>
                    Already have an account?{" "}
                    <span className="text-blue-500 hover:text-blue-600">
                      Sign In
                    </span>
                  </>
                ) : (
                  <>
                    Don&apos;t have an account?{" "}
                    <span className="text-blue-500 hover:text-blue-600">
                      Sign Up
                    </span>
                  </>
                )}
              </p>

              <div className="relative">
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="w-4/5 sm:w-3/5 border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center mt-2">
                  <span className="bg-white px-3 text-xs sm:text-sm text-black rounded">
                    OR
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="w-5/6 sm:w-3/5 bg-white text-black py-2 rounded border-black hover:bg-slate-100 border mt-4"
                onClick={handleSignInWithGoogle}
              >
                <div className="flex flex-row justify-center items-center">
                  <div className="mr-2">
                    <img
                      src={logo}
                      alt="Google logo"
                      style={{ width: "22px", height: "22px" }}
                    />
                  </div>
                  <div>
                    {loading.active && loading.type === "google" ? (
                      <BarLoader color="#3c82f6" height={3} width={75} />
                    ) : (
                      "Continue with Google"
                    )}
                  </div>
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
