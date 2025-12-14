import { useSweets } from '../context/SweetsContext';

export const AdminPanel = () => {
  const { sweets, deleteSweet } = useSweets();

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Admin Panel</h1>

      {sweets.length === 0 && <p>No sweets found</p>}

      {sweets.map(s => (
        <div key={s._id} className="flex justify-between border p-2 mb-2">
          <span>{s.name}</span>
          <button
            onClick={() => deleteSweet(s._id)}
            className="text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
