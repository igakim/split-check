import { createSlice } from '@reduxjs/toolkit';
import { generateUniqueID } from 'web-vitals/dist/modules/lib/generateUniqueID';
import { calcDebt, splitDebts } from '../utils';

const app = createSlice({
  name: 'app',
  initialState: {
    total: 0,
    persons: [],
    splits: {
      debtors: {},
      creditors: {},
    },
  },
  reducers: {
    addTotalAmount(state, { payload: amount }) {
      return { ...state, total: amount + state.total };
    },
    addPerson(state, { payload: name }) {
      const newPerson = {
        name,
        give: 0,
        debt: 0,
        id: `${name}-${generateUniqueID()}`,
      };

      return { ...state, persons: state.persons.concat(newPerson) };
    },
    addPersonGive(state, { payload: { amount, id } }) {
      return {
        ...state,
        persons: state.persons.map(
          (p) => p.id === id ? { ...p, give: amount + p.give } : p
        ),
      };
    },
    calculateDebts(state) {
      return {
        ...state,
        persons: state.persons.map((person) => ({
          ...person,
          debt: calcDebt(Number(state.total), Number(person.give), state.persons.length),
        }))
      }
    },

    splitCheck(state) {
      const { creditors, debtors } = state.persons.reduce((acc, person) => {
        if (person.debt === 0) return acc;
        if (person.debt > 0) return { ...acc, debtors: acc.debtors.concat(person) };
        return { ...acc, creditors: acc.creditors.concat(person) };
      }, { creditors: [], debtors: [] });
      const splits = splitDebts(creditors, debtors);

      return {
        ...state,
        splits,
      }
    },
  },
});

export const {
  addTotalAmount,
  addPerson,
  addPersonGive,
  calculateDebts,
  splitCheck,
} = app.actions;

export default app.reducer;
