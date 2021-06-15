import { head, merge, tail } from 'lodash';

export const calcDebt = (totalAmount, currentAmount, personAmount) =>
  Math.round((Number(totalAmount) / Number(personAmount)) - Number(currentAmount));

export const reduceDebt = (persons, debetor, total) => {
  //  persons = [{
  //         name,
  //         give: 0,
  //         id: generateUniqueID(),
  //       }]
  //  debetor = {
  //         name,
  //         give: 0,
  //         id: generateUniqueID(),
  //       };
  const debetorDebt = calcDebt(total, debetor.give, persons.length);

  const splitedByCreditor = persons
    .filter((person) => person.id !== debetor.id)
    .reduce((acc, person) => {
      const credit = calcDebt(total, person.give, persons.length);
      if (credit > 0) return acc;

      const totalCredit = Math.abs(credit);
      if (acc.restDebt > totalCredit) {
        return {
          restDebt: acc.restDebt - totalCredit,
          creditors: {
            ...acc.creditors,
            [person.id]: totalCredit,
          }
        };
      }

      return {
        restDebt: 0,
        creditors: {
          ...acc.creditors,
          [person.id]: acc.restDebt,
        }
      };
    }, { restDebt: debetorDebt, creditors: [] });

  return splitedByCreditor;
};

const splitedDebts = {
  creditors: {},
  debtors: {},
};

export const splitDebts = (creditors, debtors, acc = splitedDebts) => {
  const currentDebtor = head(debtors);
  const currentCreditor = head(creditors);
  if (creditors.length === 0 || debtors.length === 0) return acc;

  if (Math.abs(currentCreditor.debt) > Math.abs(currentDebtor.debt)) {
    const newAcc = {
      creditors: {
        ...acc.creditors,
        [currentCreditor.id]: merge(acc.creditors[currentCreditor.id], {
          [currentDebtor.id]: currentDebtor.debt,
        }),
      },
      debtors: {
        ...acc.debtors,
        [currentDebtor.id]: merge(acc.debtors[currentDebtor.id], {
          [currentCreditor.id]: currentDebtor.debt,
        }),
      },
    };
    const newDebtors = tail(debtors);
    const newCreditor = {
      ...currentCreditor,
      debt: Math.abs(currentCreditor.debt) - Math.abs(currentDebtor.debt),
    };
    const newCreditors = [newCreditor, ...tail(creditors)];
    return splitDebts(newCreditors, newDebtors, newAcc);
  }

  const newAcc = {
    creditors: {
      ...acc.creditors,
      [currentCreditor.id]: merge(acc.creditors[currentCreditor.id], {
        [currentDebtor.id]: Math.abs(currentCreditor.debt),
      }),
    },
    debtors: {
      ...acc.debtors,
      [currentDebtor.id]: merge(acc.debtors[currentDebtor.id], {
        [currentCreditor.id]: Math.abs(currentCreditor.debt),
      }),
    },
  };
  const newCreditors = tail(creditors);
  const newDebtor = {
    ...currentDebtor,
    debt: Math.abs(currentDebtor.debt) - Math.abs(currentCreditor.debt)
  };
  const newDebtors = [newDebtor, ...tail(debtors)];
  return splitDebts(newCreditors, newDebtors, newAcc);
};

export const getDebtLines = (persons, debts) => {
  const ids = Object.keys(debts);
  return ids.map((id) => {
    const person = persons.find((p) => p.id === id);
    return `Я должен ${person.name}: ${debts[id]}`;
  });
};

export const getCreditLines = (persons, credits) => {
  const ids = Object.keys(credits);
  return ids.map((id) => {
    const person = persons.find((p) => p.id === id);
    return `Мне должен ${person.name}: ${credits[id]}`;
  });
};

