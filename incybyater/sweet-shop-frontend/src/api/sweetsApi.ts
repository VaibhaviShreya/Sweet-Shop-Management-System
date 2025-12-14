const BASE_URL = 'http://localhost:5000/api/sweets';

export const getSweets = async (token: string) => {
  const res = await fetch(BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch sweets');
  }

  return res.json();
};

export const purchaseSweet = async (id: string, token: string) => {
  const res = await fetch(`${BASE_URL}/${id}/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Purchase failed');
  }

  return res.json();
};
