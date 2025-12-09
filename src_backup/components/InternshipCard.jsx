// src/components/InternshipCard.jsx
import { useNavigate } from 'react-router-dom';

export default function InternshipCard({ internship }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border p-3">
      <h3 className="font-semibold">{internship.title}</h3>
      <p className="text-sm text-gray-600">{internship.location}</p>

      <div className="mt-3 flex gap-8">
        {/* existing Apply button, etc. */}
        <button
          className="border rounded-lg px-3 py-2 hover:bg-gray-50"
          onClick={() =>
            navigate('/messages', {
              state: { startWithUserId: internship.employer_user_id },
            })
          }
        >
          Message Employer
        </button>
      </div>
    </div>
  );
}
