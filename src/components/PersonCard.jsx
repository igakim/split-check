import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPersonGive, addTotalAmount, calculateDebts, splitCheck } from '../slicers';
import { getCreditLines, getDebtLines } from '../utils';

const PersonCard = ({
  name = '',
  id,
  giveAmount = '',
  rawDebetor = {},
}) => {
  const [amountValue, setAmountValue] = useState('');
  const dispatch = useDispatch();
  const { total, persons, splits = {} } = useSelector((state) => state);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addTotalAmount(Number(amountValue)));
    dispatch(addPersonGive({
      amount: Number(amountValue),
      id,
    }));
    dispatch(calculateDebts());
    dispatch(splitCheck());
  };

  const debts = splits.debtors[id];
  const credits = splits.creditors[id];

  return (
    <div style={{ border: '1px solid black' }}>
      <h3>{name}</h3>
      <h4>GAVE: {giveAmount}</h4>
      <p>{rawDebetor.debt > 0 ? `Я должен: ${rawDebetor.debt}` : `Мне должны: ${Math.abs(rawDebetor.debt)}`}</p>
      {
        debts && (
          getDebtLines(persons, debts).map((line, idx) => <p key={idx}>{line}</p>)
        )
      }
      {
        credits && (
          getCreditLines(persons, credits).map((line, idx) => <p key={idx}>{line}</p>)
        )
      }
      <form onSubmit={handleSubmit}>
        <input type="text" name="amount" value={amountValue} onChange={(e) => setAmountValue(e.target.value)} />
        <button type="submit">Add amount</button>
      </form>
    </div>
  );
};

export default PersonCard;
