
import { useContext } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../Context/AuthContext';

const GitHubLoginButton = () => {
    const { githubSignIn } = useContext(AuthContext);

    const handleGitHubLogin = async () => {
        try {
            const result = await githubSignIn();
            const user = result.user;
            Swal.fire("Welcome!", `Logged in as ${user.displayName}`, "success");
        } catch (error) {
            console.error("GitHub login failed", error);
            Swal.fire("Error", "GitHub login failed", "error");
        }
    };

    return (
        <button
            onClick={handleGitHubLogin}
            className="btn bg-black text-white hover:bg-gray-900"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="mr-2"
                viewBox="0 0 16 16"
            >
                <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c...Z" />
            </svg>
            Sign in with GitHub
        </button>
    );
};

export default GitHubLoginButton;
