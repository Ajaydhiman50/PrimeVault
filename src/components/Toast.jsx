import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toast, setToast } = useCart();

  if (!toast) return null;

  return (
    <div className={`toast toast-${toast.type}`} onClick={() => setToast(null)}>
      <span>{toast.type === 'success' ? '✅' : '❌'}</span>
      <span>{toast.message}</span>
    </div>
  );
}
