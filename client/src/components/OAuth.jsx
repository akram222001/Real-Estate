// import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
// import { app } from '../firebase';
// import { useDispatch } from 'react-redux';
// import { signInSuccess } from '../redux/user/userSlice';
// import { useNavigate } from 'react-router-dom';
// import { FcGoogle } from "react-icons/fc";


// export default function OAuth() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const handleGoogleClick = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const auth = getAuth(app);

//       const result = await signInWithPopup(auth, provider);

//       const res = await fetch('/api/auth/google', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: result.user.displayName,
//           email: result.user.email,
//           photo: result.user.photoURL,
//         }),
//       });
//       const data = await res.json();
//       dispatch(signInSuccess(data));
//       navigate('/');
//     } catch (error) {
//       console.log('could not sign in with google', error);
//     }
//   };
//   return (
//     <button
//   onClick={handleGoogleClick}
//   type='button'
//   className='flex items-center justify-center gap-2 text-gray-600 border p-2 rounded-lg hover:bg-gray-100 transition'
// >
//   <FcGoogle size={22} />
//   <span className='font-medium'>Log in with Google</span>
// </button>

//   );
// }


import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // cookies backend se store hongi
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      console.log("Google login failed:", err);
    }
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
      />
    </div>
  );
}
