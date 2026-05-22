export default function OrderActions({
  placeOrder,
  isPending,
}: any) {

  return (

    <button
      onClick={placeOrder}
      disabled={isPending}
      className="bg-black text-white w-full p-2"
    >

      {isPending ? "Creating..." : "Create Order"}

    </button>
  );
}