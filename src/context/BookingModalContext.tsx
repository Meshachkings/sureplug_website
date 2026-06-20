import { createContext, useContext, useState, type ReactNode } from 'react';
import BookingModal from '../components/BookingModal';

interface BookingModalContextValue {
  openBookingModal: () => void;
}

const BookingModalContext = createContext<BookingModalContextValue | null>(null);

export function BookingModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <BookingModalContext.Provider value={{ openBookingModal: () => setOpen(true) }}>
      {children}
      {open && <BookingModal onClose={() => setOpen(false)} />}
    </BookingModalContext.Provider>
  );
}

export function useBookingModal() {
  const ctx = useContext(BookingModalContext);
  if (!ctx) throw new Error('useBookingModal must be used within BookingModalProvider');
  return ctx;
}
