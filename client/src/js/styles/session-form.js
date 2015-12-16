export const formStyle = {
  maxWidth: '330px',
  margin: '0 auto'
};

export const headerStyle = {
  margin: '10px 0 15px 0'
};

export const inputStyle = {
  height: 'auto',
  padding: '10px',
  fontSize: '16px'
};

export const topInputStyle = Object.assign({
  marginBottom: '-1px',
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
}, inputStyle);

export const middleInputStyle = Object.assign({
  marginBottom: '-1px',
  borderBottomLeftRadius: 0,
  borderBottomRightRadius: 0,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0
}, inputStyle);

export const bottomInputStyle = Object.assign({
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  marginBottom: '15px'
}, inputStyle);
