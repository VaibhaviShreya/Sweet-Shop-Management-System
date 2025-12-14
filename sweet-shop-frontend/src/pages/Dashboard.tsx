import { SweetCard } from '../components/SweetCard';
import { useSweets } from '../context/SweetsContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { sweets } = useSweets();
  const { user, logout } = useAuth();

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl">Sweet Shop</h1>
        <div>
          {user?.role === 'ADMIN' && <Link to="/admin" className="mr-4">Admin</Link>}
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {sweets.map(s => <SweetCard key={s.id} sweet={s} />)}
      </div>
    </div>
  );
};
