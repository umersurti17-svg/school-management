import { supabase } from '../config/supabaseClient';
import { generateReceiptNumber } from '../utils/helpers';

export const feeService = {
  /**
   * Fetch all fee invoices & payment records with search, filter, and pagination
   */
  async getFees({
    status = '',
    feeType = '',
    search = '',
    page = 1,
    pageSize = 10,
  } = {}) {
    try {
      let query = supabase
        .from('fees')
        .select(`
          id,
          fee_type,
          amount,
          due_date,
          paid_amount,
          payment_date,
          payment_method,
          receipt_number,
          status,
          academic_year,
          created_at,
          students (
            id,
            roll_number,
            class,
            section,
            guardian_name,
            guardian_phone,
            school_users (
              profiles (
                full_name,
                email
              )
            )
          )
        `, { count: 'exact' });

      if (status) query = query.eq('status', status);
      if (feeType) query = query.eq('fee_type', feeType);

      query = query.order('created_at', { ascending: false });

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (error) throw error;

      let fees = (data || []).map((f) => {
        const profile = f.students?.school_users?.profiles;
        return {
          id: f.id,
          feeType: f.fee_type,
          amount: Number(f.amount || 0),
          paidAmount: Number(f.paid_amount || 0),
          dueAmount: Math.max(0, Number(f.amount || 0) - Number(f.paid_amount || 0)),
          dueDate: f.due_date,
          paymentDate: f.payment_date,
          paymentMethod: f.payment_method || 'cash',
          receiptNumber: f.receipt_number || '—',
          status: f.status,
          academicYear: f.academic_year,
          createdAt: f.created_at,
          studentId: f.students?.id,
          studentName: profile?.full_name || 'Student',
          studentEmail: profile?.email || '',
          rollNumber: f.students?.roll_number || '—',
          class: f.students?.class || '—',
          section: f.students?.section || '—',
          guardianName: f.students?.guardian_name || '—',
          guardianPhone: f.students?.guardian_phone || '—',
        };
      });

      if (search.trim()) {
        const q = search.toLowerCase();
        fees = fees.filter(
          (f) =>
            f.studentName.toLowerCase().includes(q) ||
            f.rollNumber.toLowerCase().includes(q) ||
            f.receiptNumber.toLowerCase().includes(q) ||
            f.feeType.toLowerCase().includes(q)
        );
      }

      return {
        fees,
        totalCount: count || fees.length,
      };
    } catch (error) {
      console.error('Error in feeService.getFees:', error);
      throw error;
    }
  },

  /**
   * Get single fee invoice by ID
   */
  async getFeeById(id) {
    try {
      const { data: f, error } = await supabase
        .from('fees')
        .select(`
          id,
          fee_type,
          amount,
          due_date,
          paid_amount,
          payment_date,
          payment_method,
          receipt_number,
          status,
          academic_year,
          created_at,
          students (
            id,
            roll_number,
            class,
            section,
            guardian_name,
            guardian_phone,
            address,
            school_users (
              profiles (
                full_name,
                email,
                phone
              )
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!f) return null;

      const profile = f.students?.school_users?.profiles;
      return {
        id: f.id,
        feeType: f.fee_type,
        amount: Number(f.amount || 0),
        paidAmount: Number(f.paid_amount || 0),
        dueAmount: Math.max(0, Number(f.amount || 0) - Number(f.paid_amount || 0)),
        dueDate: f.due_date,
        paymentDate: f.payment_date,
        paymentMethod: f.payment_method || 'cash',
        receiptNumber: f.receipt_number || '—',
        status: f.status,
        academicYear: f.academic_year,
        createdAt: f.created_at,
        student: {
          id: f.students?.id,
          name: profile?.full_name || 'Student',
          email: profile?.email,
          phone: profile?.phone,
          rollNumber: f.students?.roll_number,
          class: f.students?.class,
          section: f.students?.section,
          guardianName: f.students?.guardian_name,
          guardianPhone: f.students?.guardian_phone,
          address: f.students?.address,
        },
      };
    } catch (error) {
      console.error('Error in feeService.getFeeById:', error);
      throw error;
    }
  },

  /**
   * Create new fee invoice
   */
  async createFeeInvoice(invoiceData) {
    try {
      const numAmount = Number(invoiceData.amount);
      const isPaidDirectly = invoiceData.isPaidDirectly || false;
      const paidAmount = isPaidDirectly ? numAmount : 0;
      const status = isPaidDirectly ? 'paid' : 'pending';
      const receiptNumber = isPaidDirectly ? generateReceiptNumber() : null;

      const { data, error } = await supabase
        .from('fees')
        .insert({
          student_id: invoiceData.studentId,
          fee_type: invoiceData.feeType,
          amount: numAmount,
          due_date: invoiceData.dueDate || null,
          paid_amount: paidAmount,
          payment_date: isPaidDirectly ? (invoiceData.paymentDate || new Date().toISOString().split('T')[0]) : null,
          payment_method: isPaidDirectly ? invoiceData.paymentMethod : null,
          receipt_number: receiptNumber,
          status,
          academic_year: Number(invoiceData.academicYear || 2026),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in feeService.createFeeInvoice:', error);
      throw error;
    }
  },

  /**
   * Record payment for an existing fee invoice
   */
  async recordPayment(id, { paymentAmount, paymentMethod, paymentDate }) {
    try {
      // 1. Fetch current fee record
      const current = await this.getFeeById(id);
      if (!current) throw new Error('Fee record not found');

      const addAmount = Number(paymentAmount);
      const newPaidAmount = current.paidAmount + addAmount;
      const newStatus = newPaidAmount >= current.amount ? 'paid' : 'partial';
      const receiptNumber = current.receiptNumber !== '—' ? current.receiptNumber : generateReceiptNumber();

      const { data, error } = await supabase
        .from('fees')
        .update({
          paid_amount: newPaidAmount,
          status: newStatus,
          payment_method: paymentMethod || current.paymentMethod,
          payment_date: paymentDate || new Date().toISOString().split('T')[0],
          receipt_number: receiptNumber,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in feeService.recordPayment:', error);
      throw error;
    }
  },

  /**
   * Fetch fee statement for a single student
   */
  async getStudentFeeStatement(studentId) {
    try {
      const { data, error } = await supabase
        .from('fees')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      let totalInvoiced = 0;
      let totalPaid = 0;

      const records = (data || []).map((f) => {
        const amount = Number(f.amount || 0);
        const paid = Number(f.paid_amount || 0);
        totalInvoiced += amount;
        totalPaid += paid;
        return {
          id: f.id,
          feeType: f.fee_type,
          amount,
          paidAmount: paid,
          dueAmount: Math.max(0, amount - paid),
          dueDate: f.due_date,
          paymentDate: f.payment_date,
          paymentMethod: f.payment_method,
          receiptNumber: f.receipt_number,
          status: f.status,
          academicYear: f.academic_year,
          createdAt: f.created_at,
        };
      });

      return {
        records,
        totalInvoiced,
        totalPaid,
        totalDue: Math.max(0, totalInvoiced - totalPaid),
      };
    } catch (error) {
      console.error('Error in getStudentFeeStatement:', error);
      throw error;
    }
  },

  /**
   * Update fee invoice details
   */
  async updateFeeInvoice(id, { feeType, amount, dueDate, status, paidAmount, paymentMethod, paymentDate, receiptNumber, academicYear }) {
    try {
      const updates = {};
      if (feeType !== undefined) updates.fee_type = feeType;
      if (amount !== undefined) updates.amount = Number(amount);
      if (dueDate !== undefined) updates.due_date = dueDate;
      if (status !== undefined) updates.status = status;
      if (paidAmount !== undefined) updates.paid_amount = Number(paidAmount);
      if (paymentMethod !== undefined) updates.payment_method = paymentMethod;
      if (paymentDate !== undefined) updates.payment_date = paymentDate;
      if (receiptNumber !== undefined) updates.receipt_number = receiptNumber;
      if (academicYear !== undefined) updates.academic_year = Number(academicYear);

      const { data, error } = await supabase
        .from('fees')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in feeService.updateFeeInvoice:', error);
      throw error;
    }
  },

  /**
   * Delete fee record
   */
  async deleteFee(id) {
    const { error } = await supabase.from('fees').delete().eq('id', id);
    if (error) throw error;
    return true;
  },
};
