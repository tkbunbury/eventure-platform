import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { toast } from "react-toastify";


function SignInwithGoogle() {
    async function googleLogin() {
        const provider = new GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/calendar.events'); 

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (user) {
                window.location.href = "/homepage";
            }
        } catch (error) {
            console.error("Error during Google login:", error);
            toast.error("Failed to log in with Google", {
                position: "bottom-center",
            });
        }
    }

    return (
        <div>
            <p className="continue-p">--Or continue with--</p>
            <div
                style={{ display: "flex", justifyContent: "center", cursor: "pointer" }}
                onClick={googleLogin}
            >
                <img src={require("../../../../src/google.png")} width={"60%"} alt="Google Sign-In" />
            </div>
        </div>
    );
}

export default SignInwithGoogle;
