import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Type({ orderType }: { orderType: 'products' }) {
  const [items, setItems] = useState<Array<{ name: string; imagePath: string }>>([]);

  useEffect(() => {
    if (orderType) {
      loadItems(orderType).then();
    }
  }, [orderType]);

  const loadItems = async (orderType: 'products') => {
    try {
      const response = await axios.get(`http://localhost:5000/${orderType}`);
      if (response?.data) {
        setItems(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const optionItems = items.map((item) => (
    <div key={item.name}>
      {item.name}
      <img src={`http://localhost:5000/${item.imagePath}`} alt={`${item.name} product`} />
    </div>
  ));

  return <div>{optionItems}</div>;
}
