import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTotalAmount } from './slicers';
import AddPersonForm from './components/AddPersonForm';
import PersonCard from './components/PersonCard';
import TotalAmount from './components/TotalAmount';

const App = () => {
  const persons = useSelector((state) => state.persons);

  return (
    <div>
      <AddPersonForm />
      <div style={{ height: 30 }} />
      <TotalAmount />
      <div style={{ height: 30 }} />

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {
          persons.map((p) => (
            <PersonCard key={p.id} name={p.name} id={p.id} giveAmount={p.give} rawDebetor={p} />
          ))
        }
      </div>
    </div>
  );
};

export default App;
