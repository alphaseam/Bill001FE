export const calculateTotals = (items) => {
  let subtotal = 0;
  items.forEach((item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice) || 0;
    const discount = parseFloat(item.discount) || 0;
    item.total = quantity * unitPrice - discount;
    subtotal += item.total;
  });
  const tax = subtotal * 0.12;
  const finalAmount = subtotal + tax;
  return { subtotal, tax, finalAmount };
};
