import { useEffect, useState } from "react";

const Input = ({ label, name, value, isEditing, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
      {label}
    </label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      disabled={!isEditing}
      className={`border rounded-lg px-3 py-2 text-sm transition-all ${
        isEditing
          ? "bg-white border-blue-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          : "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
      } focus:outline-none`}
    />
  </div>
);

const TextArea = ({ label, name, value, isEditing, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
      {label}
    </label>
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      disabled={!isEditing}
      rows={3}
      className={`border rounded-lg px-3 py-2 text-sm resize-none transition-all ${
        isEditing
          ? "bg-white border-blue-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          : "bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed"
      } focus:outline-none`}
    />
  </div>
);

const SENTIMENT_COLORS = {
  positive: "bg-green-50 text-green-700 border-green-200",
  negative: "bg-red-50 text-red-700 border-red-200",
  neutral: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

export default function InteractionForm({ formData }) {
  const empty = {
    doctor_name: "",
    date: "",
    time: "",
    interaction_type: "",
    attendees: "",
    topics_discussed: "",
    outcome: "",
    sentiment: "",
    follow_up: "",
  };

  const [form, setForm] = useState(empty);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!formData) return;
    setForm({
      doctor_name: formData.doctor_name || "",
      date: formData.date || "",
      time: formData.time || "",
      interaction_type: formData.interaction_type || "",
      attendees: formData.attendees || "",
      topics_discussed: formData.topics_discussed || "",
      outcome: formData.outcome || "",
      sentiment: formData.sentiment || "",
      follow_up: formData.follow_up || "",
    });
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saved:", form);
    setIsEditing(false);
  };

  const handleReset = () => {
    window.location.reload();
  };

  const sentimentKey = (form.sentiment || "").toLowerCase();
  const sentimentClass =
    SENTIMENT_COLORS[sentimentKey] ||
    "bg-gray-50 text-gray-600 border-gray-200";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-4 h-full">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Interaction Details
          </h2>
          <p className="text-sm text-gray-400">
            AI-extracted HCP interaction data
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Reset
          </button>

          {isEditing && (
            <button
              onClick={() => {
                setForm(formData || empty);
                setIsEditing(false);
              }}
              className="px-3 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}

          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={`px-3 py-1.5 rounded-lg text-xs text-white font-medium ${
              isEditing
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
      </div>

      {/* ROW 1 (2 inputs) */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Doctor Name"
          name="doctor_name"
          value={form.doctor_name}
          isEditing={isEditing}
          onChange={handleChange}
        />
        <Input
          label="Date"
          name="date"
          value={form.date}
          isEditing={isEditing}
          onChange={handleChange}
        />
      </div>

      {/* ROW 2 (2 inputs) */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Time"
          name="time"
          value={form.time}
          isEditing={isEditing}
          onChange={handleChange}
        />
        <Input
          label="Interaction Type"
          name="interaction_type"
          value={form.interaction_type}
          isEditing={isEditing}
          onChange={handleChange}
        />
      </div>

      {/* ROW 3 (2 inputs) */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Attendees"
          name="attendees"
          value={form.attendees}
          isEditing={isEditing}
          onChange={handleChange}
        />

        {/* Sentiment */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Sentiment
          </label>

          {isEditing ? (
            <input
              name="sentiment"
              value={form.sentiment}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 text-sm border-blue-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          ) : (
            <div
              className={`border rounded-lg px-3 py-2 text-sm font-medium capitalize ${sentimentClass}`}
            >
              {form.sentiment || "—"}
            </div>
          )}
        </div>
      </div>

      {/* TEXT AREAS */}
      <div className="grid grid-cols-2 gap-4">
        <TextArea
          label="Topics Discussed"
          name="topics_discussed"
          value={form.topics_discussed}
          isEditing={isEditing}
          onChange={handleChange}
        />

        <TextArea
          label="Outcome"
          name="outcome"
          value={form.outcome}
          isEditing={isEditing}
          onChange={handleChange}
        />
      </div>

      {/* FOLLOW-UP */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Follow-up Recommendation
        </label>

        <div className="p-4 border border-blue-200 rounded-xl bg-blue-50 text-sm text-blue-800">
          {form.follow_up || "No follow-up recommendation generated yet."}
        </div>
      </div>
      {/* AI SUGGESTIONS */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          AI Suggestions
        </label>

        <div className="p-4 border border-blue-200 rounded-xl bg-blue-50 text-sm text-blue-900 space-y-2">
          {/* Suggestion 1 */}
          <div className="flex gap-2">
            <span>💡</span>
            <span>
              Consider scheduling a follow-up within <b>7–10 days</b> to
              maintain engagement.
            </span>
          </div>
     </div>
      </div>
    </div>
  );
}
