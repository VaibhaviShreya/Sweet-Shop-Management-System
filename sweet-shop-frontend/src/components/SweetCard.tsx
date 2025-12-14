import { useSweets } from '../context/SweetsContext';

export const SweetCard = ({ sweet }: any) => {
  const { purchase } = useSweets();

  return (
    <div>
      <h3>{sweet.name}</h3>
      <p>{sweet.category}</p>
      <p>${sweet.price}</p>
      <button
        disabled={sweet.quantity === 0}
        onClick={() => purchase(sweet._id)}
      >
        {sweet.quantity === 0 ? 'Out of Stock' : 'Purchase'}
      </button>
    </div>
  );
};
