export default function CartItems({
  cart,
  removeFromCart,
}: any) {

  if (!cart.length) {
    return <p>No products selected</p>;
  }

  return (

    <div className="border p-3">

      {cart.map((item: any) => (

        <div
          key={item.id}
          className="flex justify-between p-2 border-b"
        >

          <div>

            <p>{item.title}</p>

            <p>
              {item.qty} × ₹{item.price}
            </p>

          </div>

          <button
            onClick={() => removeFromCart(item.id)}
          >
            Remove
          </button>

        </div>
      ))}

    </div>
  );
}