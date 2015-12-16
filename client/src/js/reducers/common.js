import _ from 'lodash';

export const updateList = (curr, next) => {
  return next;
};

export const updateOneById = (curr, newItem) => {
  const index = _(curr).pluck('id').indexOf(newItem.id);
  if (index < 0) {
    return [newItem].concat(curr);
  } else {
    return curr.slice(0, index).
      concat([newItem]).
      concat(curr.slice(index + 1));
  }
};

export const deleteById = (curr, id) => {
  return curr.filter(r => r.id !== id);
};
