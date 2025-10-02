const Money = (value: any) => {
   return parseFloat(value) < 0 ? `-$ ${value.slice(1)}` : `$ ${value}`;
};

export default Money;
