import React from 'react';
import { useSelector } from 'react-redux';

const TotalAmount = () => {
  const totalAmount = useSelector((state) => state.total);

  return (
    <div style={{ textAlign: 'center' }}>{totalAmount}</div>
  );
};

export default TotalAmount;
