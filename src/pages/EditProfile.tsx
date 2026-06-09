import { useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import {
    changeWork,
    changeEducation,
    changeHometown,
    changeCurrentPlace,
    changeRelationshipStatus,
} from "../services/user";


export default function EditProfile() {
    const [work, setWork] = useState("");
    const [education, setEducation] = useState("");
    const [hometown, setHometown] = useState("");
    const [current_place, setCurrentPlace] = useState("");
    const [relationship, setRelationship] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const { id_user } = useParams();

    const handleSave = async () => {
        try {
            const myId = id_user || localStorage.getItem("user_id");

            if (name && myId) {
                localStorage.setItem(`name_${myId}`, name);
            }

            if (surname && myId) {
                localStorage.setItem(`surname_${myId}`, surname);
            }

            if (work) await changeWork(work);

            if (education) await changeEducation(education);

            if (hometown) await changeHometown(hometown);

            if (current_place)
                await changeCurrentPlace(current_place);

            if (relationship)
                await changeRelationshipStatus(relationship);

            alert("Saved ✅");
        } catch (err: any) {
            console.log("ERR:", err);
            console.log("DATA:", err?.response?.data);

            alert(err?.response?.data?.error || "Error");
        }

        window.location.href = "/profile";

    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />

            <div className="max-w-xl mx-auto bg-white p-4 mt-4 rounded shadow space-y-3">

                <h2 className="text-xl font-bold">
                    Edit Profile
                </h2>

                <input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 w-full"
                />

                <input
                    placeholder="Surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="border p-2 w-full"
                />

                <input
                    placeholder="Work"
                    value={work}
                    onChange={(e) => setWork(e.target.value)}
                    className="border p-2 w-full"
                />

                <input
                    placeholder="Education"
                    value={education}
                    onChange={(e) =>
                        setEducation(e.target.value)
                    }
                    className="border p-2 w-full"
                />

                <input
                    placeholder="Hometown"
                    value={hometown}
                    onChange={(e) =>
                        setHometown(e.target.value)
                    }
                    className="border p-2 w-full"
                />

                <input
                    placeholder="Current place"
                    value={current_place}
                    onChange={(e) =>
                        setCurrentPlace(e.target.value)
                    }
                    className="border p-2 w-full"
                />

                <input
                    placeholder="Relationship status"
                    value={relationship}
                    onChange={(e) =>
                        setRelationship(e.target.value)
                    }
                    className="border p-2 w-full"
                />

                <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}