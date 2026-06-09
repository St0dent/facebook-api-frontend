import { useNavigate } from "react-router-dom";
import { removeToken } from "../services/token";
import { useState } from "react";
import { search } from "../services/search";
import { logout } from "../services/auth";

export default function Navbar() {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const navigate = useNavigate();

    const myId = localStorage.getItem("user_id");

    const handleSearch = async (value: string) => {
        setQuery(value);

        if (!value) {
            setResults([]);
            return;
        }

        try {
            const res = await search(value);
            setResults(res);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="bg-white shadow px-6 py-3 flex items-center justify-between sticky top-0 z-50">

            {/* Logo */}
            <h1
                className="text-blue-600 font-bold text-2xl cursor-pointer"
                onClick={() => navigate("/")}
            >
                facebook
            </h1>

            {/* Search */}
            <div className="relative">
                <input
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search Facebook"
                    className="bg-gray-100 px-4 py-2 rounded-full outline-none"
                />

                {results.length > 0 && (
                    <div className="absolute bg-white shadow rounded w-64 mt-2 max-h-60 overflow-auto z-50">

                        <p className="text-gray-500 text-xs px-2 mt-1">
                            Users
                        </p>

                        {results.slice(0, 10).map((id, i) => (
                            <div
                                key={i}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => navigate(`/profile/${myId}`)}
                            >
                                User {id}
                            </div>
                        ))}

                        <p className="text-gray-500 text-xs px-2 mt-2">
                            Posts
                        </p>

                        {results.slice(10).map((id, i) => (
                            <div
                                key={i}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => navigate(`/post/${id}`)}
                            >
                                Post {id}
                            </div>
                        ))}

                    </div>
                )}
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3">

                {/* PROFILE BUTTON */}
                <button
                    onClick={() => navigate(`/profile/${myId}`)}
                    className="bg-gray-200 px-4 py-2 rounded-full hover:bg-gray-300"
                >
                    Profile
                </button>

                {/* LOGOUT */}
                <button
                    onClick={async () => {
                        await logout(); 

                        localStorage.removeItem("token");
                        localStorage.removeItem("user_id");

                        navigate("/login");
                    }}
                    className="bg-gray-200 px-4 py-2 rounded-full hover:bg-gray-300"
                >
                    Logout
                </button>


            </div>
        </div>
    );
}