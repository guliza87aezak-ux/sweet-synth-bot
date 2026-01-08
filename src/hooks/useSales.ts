import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sale, CartItem } from '@/types/pos';
import { toast } from 'sonner';

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch sales from Supabase
  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedSales: Sale[] = (data || []).map((sale) => ({
        id: sale.id,
        items: (sale.items as unknown as CartItem[]) || [],
        total: Number(sale.total),
        paymentMethod: sale.payment_method as 'cash' | 'card' | 'debt' | 'mixed',
        timestamp: new Date(sale.created_at || new Date()),
        cashReceived: sale.cash_received ? Number(sale.cash_received) : undefined,
        change: sale.change_amount ? Number(sale.change_amount) : undefined,
        customerName: sale.customer_name || undefined,
        customerPhone: sale.customer_phone || undefined,
        isPaid: sale.is_paid ?? true,
        // Extract mixed payment amounts from items JSON if stored there
        cashAmount: (sale.items as any)?.cashAmount,
        cardAmount: (sale.items as any)?.cardAmount,
        debtAmount: (sale.items as any)?.debtAmount,
      }));

      setSales(mappedSales);
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error('Сатууларды жүктөөдө ката');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Add a new sale to Supabase
  const addSale = async (
    cart: CartItem[],
    total: number,
    paymentMethod: 'cash' | 'card' | 'debt' | 'mixed',
    cashReceived?: number,
    customerName?: string,
    customerPhone?: string,
    cashAmount?: number,
    cardAmount?: number,
    debtAmount?: number
  ): Promise<Sale | null> => {
    try {
      // Store mixed payment details in items JSON
      const itemsWithPaymentDetails = {
        items: cart,
        cashAmount,
        cardAmount,
        debtAmount,
      };

      const isPaid = paymentMethod !== 'debt' && !(paymentMethod === 'mixed' && debtAmount && debtAmount > 0);

      const insertData: {
        items: unknown;
        total: number;
        payment_method: string;
        cash_received: number | null;
        change_amount: number | null;
        customer_name: string | null;
        customer_phone: string | null;
        is_paid: boolean;
      } = {
        items: itemsWithPaymentDetails,
        total,
        payment_method: paymentMethod,
        cash_received: cashReceived || null,
        change_amount: cashReceived ? cashReceived - total : null,
        customer_name: customerName || null,
        customer_phone: customerPhone || null,
        is_paid: isPaid,
      };

      const { data, error } = await supabase
        .from('sales')
        .insert(insertData as any)
        .select()
        .single();

      if (error) throw error;

      const newSale: Sale = {
        id: data.id,
        items: cart,
        total: Number(data.total),
        paymentMethod: data.payment_method as 'cash' | 'card' | 'debt' | 'mixed',
        timestamp: new Date(data.created_at || new Date()),
        cashReceived: data.cash_received ? Number(data.cash_received) : undefined,
        change: data.change_amount ? Number(data.change_amount) : undefined,
        customerName: data.customer_name || undefined,
        customerPhone: data.customer_phone || undefined,
        isPaid: data.is_paid ?? true,
        cashAmount,
        cardAmount,
        debtAmount,
      };

      setSales((prev) => [newSale, ...prev]);
      return newSale;
    } catch (error) {
      console.error('Error adding sale:', error);
      toast.error('Сатууну сактоодо ката');
      return null;
    }
  };

  // Pay debt - update sale in Supabase
  const payDebt = async (saleId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('sales')
        .update({ is_paid: true })
        .eq('id', saleId);

      if (error) throw error;

      setSales((prev) =>
        prev.map((sale) =>
          sale.id === saleId ? { ...sale, isPaid: true } : sale
        )
      );

      toast.success('Долг погашен!');
      return true;
    } catch (error) {
      console.error('Error paying debt:', error);
      toast.error('Долгду жабууда ката');
      return false;
    }
  };

  return {
    sales,
    loading,
    addSale,
    payDebt,
    refetch: fetchSales,
  };
};
