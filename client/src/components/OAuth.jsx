import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../config";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    console.log("🔐 Google credential received:", credentialResponse);

    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      console.log("📤 Google auth response status:", res.status);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("📥 Google auth response data:", data);

      // ✅ Check if token exists in response
      if (!data.token) {
        console.warn("⚠️ No token in Google auth response. Adding manually...");
        // Create a token from user ID (temporary fix)
        const tempToken = btoa(
          JSON.stringify({
            id: data._id,
            email: data.email,
            source: "google",
            timestamp: Date.now(),
          })
        );
        data.token = tempToken;
      }

      // ✅ IMPORTANT: Save token to localStorage
      localStorage.setItem("token", data.token);
      console.log(
        "✅ Token saved to localStorage:",
        data.token.substring(0, 20) + "..."
      );

      // ✅ Store user WITH token in Redux
      dispatch(
        signInSuccess({
          ...data,
          token: data.token,
        })
      );

      navigate("/profile");
    } catch (err) {
      console.error("❌ Google login failed:", err);
      alert("Google login failed: " + err.message);
    }
  };

  const handleError = () => {
    console.log("❌ Google Login Failed");
    alert("Google login failed. Please try again or use email/password.");
  };

  return (
    // <div>
    //   <GoogleLogin
    //     onSuccess={handleSuccess}
    //     onError={handleError}
    //     useOneTap
    //   />
    // </div>
    <div className="w-full flex flex-col gap-2">
      {/* Full-width standard button as fallback */}
      <div className="w-full max-w-md">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          text="continue_with"
          size="large"
          shape="rectangular"
        />
      </div>
    </div>
  );
}
