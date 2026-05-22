export default function OrderSummary({ cart }: any) {

  const total = cart.reduce(
    (sum: number, i: any) =>
      sum + i.qty * i.price,
    0
  );

  return (

    <div className="border p-3">

      <h3>Total</h3>

      <p>₹{total}</p>

    </div>
  );
}