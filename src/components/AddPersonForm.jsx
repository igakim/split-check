import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPerson, addPersonGive, calculateDebts, splitCheck } from '../slicers';

const AddPersonForm = () => {
  const [nameValue, setNameValue] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(addPerson(nameValue));
    dispatch(calculateDebts());
    dispatch(splitCheck());
  };

  const handleChangeName = (e) => setNameValue(e.target.value);

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={nameValue} onChange={handleChangeName} />
      <button type="submit">Add Person</button>
    </form>
  );
};

export default AddPersonForm;
