import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Type({ orderType }: { orderType: 'products' }) {
  const [items, setItems] = useState<Array<{ name: string; imagePath: string }>>([]);
  const [error, setError] = useState<boolean>(false);

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
      setError(true);
      console.log(err);
    }
  };

  const optionItems = items.map((item) => (
    <div key={item.name}>
      {item.name}
      <img src={`http://localhost:5000/${item.imagePath}`} alt={`${item.name} product`} />
    </div>
  ));

  if (error) {
    return <ErrorBanner message={'에러가 발생했습니다.'} />;
  }

  return <div>{optionItems}</div>;
}

function ErrorBanner({ message }: { message: string }) {
  return <div data-testid={'error-banner'}>{message}</div>;
}
