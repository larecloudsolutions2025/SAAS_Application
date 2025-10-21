// Profile.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BackButton from "./components/BackButton";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ full_name: "", dob: "", gender: "" });
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/auth/profile", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        if (data.profile) setForm(data.profile);
      })
      .catch(() => {
        toast.error("Session expired. Please login again.");
        navigate("/");
      });
  }, [navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    const res = await fetch("http://localhost:8000/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Profile updated successfully!");
      setProfile({ ...profile, profile: data.profile });
      setEditing(false);
    } else toast.error(data.detail || "Update failed.");
  };

  if (!profile) return <div className="p-10">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <BackButton fallback="/dashboard" label="Back to Dashboard" />
        <h1 className="text-2xl font-bold text-black">Profile</h1>

        {!editing ? (
          <div className="mt-4 text-black space-y-2">
            <p><b>Username:</b> {profile.username}</p>
            <p><b>Email:</b> {profile.email}</p>
            <p><b>Full Name:</b> {profile.profile.full_name}</p>
            <p><b>DOB:</b> {profile.profile.dob}</p>
            <p><b>Gender:</b> {profile.profile.gender}</p>
            <button
              className="mt-4 bg-orange-400 text-black px-4 py-2 rounded font-bold hover:bg-orange-500"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            <input
              name="full_name"
              value={form.full_name || ""}
              onChange={handleChange}
              className="border p-2 rounded text-black"
              placeholder="Full Name"
            />
            <input
              name="dob"
              type="date"
              value={form.dob || ""}
              onChange={handleChange}
              className="border p-2 rounded text-black"
            />
            <select
              name="gender"
              value={form.gender || ""}
              onChange={handleChange}
              className="border p-2 rounded text-black"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="bg-orange-400 px-4 py-2 rounded font-bold text-black hover:bg-orange-500"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-400 px-4 py-2 rounded font-bold text-black hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
