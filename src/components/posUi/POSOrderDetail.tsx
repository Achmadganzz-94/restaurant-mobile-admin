import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../config/Api";

type OrderItem = {
  id?: string;
  quantity?: number;
  price?: number;
  notes?: string;
  menuItem?: {
    name?: string;
  };
};

type Payment = {
  method?: string;
  payAmount?: number;
  changeAmount?: number;
  amount?: number;
};

type Order = {
  id?: string;
  orderNumber?: string;

  customer?: {
    name?: string;
  };

  customerName?: string;

  orderType?: string;
  tableNumber?: string | number;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;

  orderItems?: OrderItem[];
  items?: OrderItem[];

  note?: string;

  subtotal?: number;

  // Discount
  discountMember?: number;
  discount?: number;
  discountAmount?: number;

  totalPrice?: number;

  payment?: Payment;
};

type StatusHistory = {
  id?: string;
  status?: string;
  changedAt?: string;
  note?: string;

  changedBy?: {
    name?: string;
    role?: string;
  };
};

type Props = {
  visible: boolean;
  order: Order | null;
  token: string;
  formatRupiah: (value: number) => string;
  onClose: () => void;
  onOrderUpdated?: (order: Order) => void;
};

const STATUS_PENDING = "PENDING";
const STATUS_PAID = "PAID";
const PAYMENT_UNPAID = "UNPAID";

const STATUS_OPTIONS = [
  STATUS_PENDING,
  "PREPARING",
  "READY",
  "SERVED",
  "COMPLETED",
  "CANCELLED",
];

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Pending",
  PREPARING: "Diproses",
  READY: "Ready",
  SERVED: "Served",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const PAYMENT_LABEL: Record<string, string> = {
  UNPAID: "Belum Bayar",
  PAID: "Lunas",
  REFUNDED: "Dikembalikan",
};

const ORDER_TYPE_LABEL: Record<string, string> = {
  DINE_IN: "Dine In",
  TAKEAWAY: "Takeaway",
  DELIVERY: "Delivery",
};

const PAYMENT_METHODS = [
  {
    value: "CASH",
    label: "Cash",
  },
  {
    value: "QRIS",
    label: "QRIS",
  },
  {
    value: "TRANSFER",
    label: "Transfer",
  },
];

const STATUS_STYLE: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
  }
> = {
  PENDING: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/20",
  },

  PREPARING: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
  },

  READY: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "border-violet-500/20",
  },

  SERVED: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
  },

  COMPLETED: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/20",
  },

  CANCELLED: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
  },
};

const formatDate = (date?: string) => {
  if (!date) return "-";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "-";
  }

  return value.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (date?: string) => {
  if (!date) return "-";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "-";
  }

  return value.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const formatDateTime = (date?: string) => {
  if (!date) return "-";

  return `${formatDate(date)}, ${formatTime(date)}`;
};

export default function POSOrderDetail({
  visible,
  order,
  token,
  formatRupiah,
  onClose,
  onOrderUpdated,
}: Props) {
  const [newStatus, setNewStatus] = useState(STATUS_PENDING);

  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paymentAmount, setPaymentAmount] = useState("");

  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (!visible || !order) return;

    const currentStatus = order.status?.toUpperCase() || STATUS_PENDING;

    setNewStatus(currentStatus);
    setStatusMessage("");
    setPaymentAmount("");
    setPaymentMessage("");
    setShowInvoice(false);

    fetchStatusHistory(order.id);
  }, [visible, order?.id]);

  const fetchStatusHistory = async (orderId?: string) => {
    if (!orderId) {
      setStatusHistory([]);
      return;
    }

    try {
      setLoadingHistory(true);

      const response = await api.get(`/orders/${orderId}/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data?.data;

      setStatusHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("FETCH HISTORY ERROR:", error);

      setStatusHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!order?.id) return;

    const currentStatus = order.status?.toUpperCase() || STATUS_PENDING;

    if (newStatus === currentStatus) {
      setStatusMessage("Status belum berubah.");

      return;
    }

    try {
      setUpdatingStatus(true);
      setStatusMessage("");

      const response = await api.patch(
        `/orders/${order.id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedOrder = response.data?.data?.updatedOrder;

      const updatedStatus = updatedOrder?.status || newStatus;

      const updatedData: Order = {
        ...order,
        status: updatedStatus,
      };

      setNewStatus(updatedStatus);

      onOrderUpdated?.(updatedData);

      setStatusMessage("Status pesanan berhasil diperbarui.");

      await fetchStatusHistory(order.id);
    } catch (error: any) {
      console.log("UPDATE STATUS ERROR:", error);

      const message =
        error?.response?.data?.message || "Gagal memperbarui status pesanan.";

      setStatusMessage(message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!order?.id) return;

    const amount = Number(paymentAmount);

    const total = Number(totalPrice);

    if (!amount || amount <= 0) {
      setPaymentMessage("Masukkan jumlah pembayaran.");

      return;
    }

    if (amount < total) {
      setPaymentMessage(
        `Pembayaran kurang. Total tagihan ${formatRupiah(total)}.`,
      );

      return;
    }

    try {
      setProcessingPayment(true);
      setPaymentMessage("");

      const response = await api.post(
        "/payments",
        {
          orderId: order.id,
          amount,
          method: paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const payment = response.data?.data?.payment;

      const updatedData: Order = {
        ...order,

        paymentStatus: STATUS_PAID,

        payment: payment || {
          method: paymentMethod,
          payAmount: amount,
          changeAmount: amount - total,
        },
      };

      setPaymentAmount("");

      setPaymentMessage("Pembayaran berhasil dicatat.");

      onOrderUpdated?.(updatedData);
    } catch (error: any) {
      console.log("PROCESS PAYMENT ERROR:", error);

      const message =
        error?.response?.data?.message || "Gagal memproses pembayaran.";

      setPaymentMessage(message);
    } finally {
      setProcessingPayment(false);
    }
  };

  if (!order) return null;

  const status = order.status?.toUpperCase() || STATUS_PENDING;

  const paymentStatus = order.paymentStatus?.toUpperCase() || PAYMENT_UNPAID;

  const isPaid = paymentStatus === STATUS_PAID;

  const statusStyle = STATUS_STYLE[status] || STATUS_STYLE[STATUS_PENDING];

  const customerName = order.customer?.name || order.customerName || "Walk-in";

  const orderTypeKey = order.orderType?.toUpperCase() || "";

  const orderType = ORDER_TYPE_LABEL[orderTypeKey] || order.orderType || "-";

  const orderItems = order.orderItems || order.items || [];

  /**
   * SUBTOTAL
   *
   * Kalau backend mengirim subtotal,
   * gunakan subtotal tersebut.
   *
   * Kalau tidak ada, hitung dari item.
   */
  const subtotal = Number(
    order.subtotal ??
      orderItems.reduce(
        (total, item) =>
          total + Number(item.price || 0) * Number(item.quantity || 0),
        0,
      ),
  );

  /**
   * DISCOUNT
   *
   * Prioritas:
   * 1. discountMember
   * 2. discountAmount
   * 3. discount
   */
  const discountMember = Math.max(
    0,
    Number(order.discountMember ?? order.discountAmount ?? order.discount ?? 0),
  );

  /**
   * TOTAL
   *
   * Tax dan Service Charge sudah
   * tidak digunakan.
   *
   * Total = Subtotal - Discount
   */
  const totalPrice = Math.max(0, subtotal - discountMember);

  const payment = order.payment;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60">
        <View className="mt-auto max-h-[95%] rounded-t-[28px] bg-[#071A33]">
          {/* HEADER */}

          <View className="flex-row items-start justify-between border-b border-white/10 px-5 py-5">
            <View className="flex-1">
              <Text className="text-[10px] font-bold uppercase tracking-[2px] text-[#4DB5FF]">
                Order Detail
              </Text>

              <Text className="mt-1 text-2xl font-extrabold text-white">
                {order.orderNumber || "Order"}
              </Text>

              <Text className="mt-1 text-xs text-white/40">
                {formatDate(order.createdAt)}
                {" • "}
                {formatTime(order.createdAt)}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              className="ml-3 h-11 w-11 items-center justify-center rounded-xl bg-white/10 active:opacity-70"
            >
              <Ionicons name="close" size={22} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 35,
            }}
          >
            {/* INFORMASI ORDER */}

            <View className="px-5 pt-5">
              <View className="flex-row gap-2">
                <View className="flex-1 rounded-2xl bg-[#0D2544] p-3">
                  <Text className="text-[9px] font-semibold uppercase tracking-wide text-white/35">
                    Customer
                  </Text>

                  <Text className="mt-2 text-sm font-bold text-white">
                    {customerName}
                  </Text>

                  {!!order.customer?.name && (
                    <View className="mt-2 self-start rounded-full bg-green-500/10 px-2.5 py-1">
                      <Text className="text-[9px] font-bold text-green-400">
                        MEMBER
                      </Text>
                    </View>
                  )}
                </View>

                <View className="flex-1 rounded-2xl bg-[#0D2544] p-3">
                  <Text className="text-[9px] font-semibold uppercase tracking-wide text-white/35">
                    Meja
                  </Text>

                  <Text className="mt-2 text-sm font-bold text-white">
                    {order.tableNumber ? `Meja ${order.tableNumber}` : "-"}
                  </Text>
                </View>
              </View>

              <View className="mt-2 flex-row gap-2">
                <View className="flex-1 rounded-2xl bg-[#0D2544] p-3">
                  <Text className="text-[9px] font-semibold uppercase tracking-wide text-white/35">
                    Tipe
                  </Text>

                  <Text className="mt-2 text-sm font-bold text-white">
                    {orderType}
                  </Text>
                </View>

                <View className="flex-1 rounded-2xl bg-[#0D2544] p-3">
                  <Text className="mb-2 text-[9px] font-semibold uppercase tracking-wide text-white/35">
                    Status
                  </Text>

                  <View
                    className={`rounded-xl border px-3 py-2 ${statusStyle.bg} ${statusStyle.border}`}
                  >
                    <Text className={`text-xs font-bold ${statusStyle.text}`}>
                      {STATUS_LABEL[status] || status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* PERUBAHAN STATUS */}

            <View className="mx-5 mt-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
              <Text className="text-xs font-bold text-blue-400">
                Perubahan Status
              </Text>

              <Text className="mt-1 text-[10px] text-blue-300/60">
                Pilih status baru untuk pesanan.
              </Text>

              <View className="mt-3 flex-row flex-wrap gap-2">
                {STATUS_OPTIONS.map((option) => {
                  const active = newStatus === option;

                  return (
                    <Pressable
                      key={option}
                      onPress={() => {
                        setNewStatus(option);
                        setStatusMessage("");
                      }}
                      className={`rounded-xl border px-3 py-2 ${
                        active
                          ? "border-blue-500 bg-blue-500"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <Text
                        className={`text-[10px] font-bold ${
                          active ? "text-white" : "text-white/50"
                        }`}
                      >
                        {STATUS_LABEL[option]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Pressable
                onPress={handleUpdateStatus}
                disabled={updatingStatus || newStatus === status}
                className={`mt-3 items-center rounded-xl py-3 ${
                  updatingStatus || newStatus === status
                    ? "bg-white/5"
                    : "bg-[#1677FF]"
                }`}
              >
                {updatingStatus ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text
                    className={`text-xs font-bold ${
                      newStatus === status ? "text-white/30" : "text-white"
                    }`}
                  >
                    Simpan Perubahan
                  </Text>
                )}
              </Pressable>

              {!!statusMessage && (
                <Text className="mt-2 text-center text-[10px] text-white/50">
                  {statusMessage}
                </Text>
              )}
            </View>

            {/* ITEM PESANAN */}

            <View className="px-5 pt-6">
              <Text className="mb-3 text-base font-extrabold text-white">
                Pesanan
              </Text>

              <View className="overflow-hidden rounded-2xl border border-white/10 bg-[#0D2544]">
                {orderItems.length === 0 ? (
                  <View className="p-5">
                    <Text className="text-center text-xs text-white/40">
                      Tidak ada item pesanan.
                    </Text>
                  </View>
                ) : (
                  orderItems.map((item, index) => {
                    const itemName = item.menuItem?.name || "Menu";

                    const quantity = Number(item.quantity || 0);

                    const price = Number(item.price || 0);

                    const itemTotal = price * quantity;

                    const hasNote = Boolean(item.notes);

                    return (
                      <View
                        key={item.id || `${itemName}-${index}`}
                        className={`p-4 ${
                          index < orderItems.length - 1
                            ? "border-b border-white/10"
                            : ""
                        }`}
                      >
                        <View className="flex-row items-center justify-between">
                          <View className="flex-1 pr-4">
                            <Text className="text-sm font-bold text-white">
                              {itemName}
                            </Text>

                            <Text className="mt-1 text-xs text-white/40">
                              {quantity}
                              {" × "}
                              {formatRupiah(price)}
                            </Text>

                            {hasNote && (
                              <Text className="mt-1 text-[10px] italic text-white/40">
                                Catatan: {item.notes}
                              </Text>
                            )}
                          </View>

                          <Text className="text-sm font-extrabold text-white">
                            {formatRupiah(itemTotal)}
                          </Text>
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            </View>

            {/* CATATAN */}

            {!!order.note && (
              <View className="mx-5 mt-5 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                <Text className="text-[9px] font-bold uppercase tracking-wide text-yellow-400">
                  Catatan Order
                </Text>

                <Text className="mt-1 text-xs leading-5 text-yellow-200/70">
                  {order.note}
                </Text>
              </View>
            )}

            {/* PEMBAYARAN */}

            <View className="px-5 pt-6">
              <Text className="mb-3 text-base font-extrabold text-white">
                Pembayaran
              </Text>

              <View className="rounded-2xl bg-[#0D2544] p-4">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-[10px] text-white/40">
                      Status Pembayaran
                    </Text>

                    <View
                      className={`mt-2 self-start rounded-full border px-3 py-1.5 ${
                        isPaid
                          ? "border-green-500/20 bg-green-500/10"
                          : "border-red-500/20 bg-red-500/10"
                      }`}
                    >
                      <Text
                        className={`text-[9px] font-extrabold ${
                          isPaid ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {PAYMENT_LABEL[paymentStatus] || paymentStatus}
                      </Text>
                    </View>
                  </View>

                  {!!payment && (
                    <View className="items-end">
                      <Text className="text-[10px] text-white/40">
                        Metode Pembayaran
                      </Text>

                      <Text className="mt-1 text-sm font-bold text-white">
                        {payment.method || "-"}
                      </Text>
                    </View>
                  )}
                </View>

                {!isPaid && (
                  <View className="mt-4 border-t border-white/10 pt-4">
                    <Text className="text-[9px] font-bold uppercase tracking-wide text-white/40">
                      Metode Pembayaran
                    </Text>

                    <View className="mt-2 flex-row gap-2">
                      {PAYMENT_METHODS.map((method) => {
                        const active = paymentMethod === method.value;

                        return (
                          <Pressable
                            key={method.value}
                            onPress={() => {
                              setPaymentMethod(method.value);
                              setPaymentMessage("");
                            }}
                            className={`flex-1 items-center rounded-xl border py-3 ${
                              active
                                ? "border-green-500 bg-green-500/10"
                                : "border-white/10 bg-white/5"
                            }`}
                          >
                            <Text
                              className={`text-[10px] font-bold ${
                                active ? "text-green-400" : "text-white/50"
                              }`}
                            >
                              {method.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>

                    <Text className="mt-4 text-[9px] font-bold uppercase tracking-wide text-white/40">
                      Jumlah Dibayar
                    </Text>

                    <TextInput
                      value={paymentAmount}
                      onChangeText={(value) => {
                        setPaymentAmount(value.replace(/[^0-9]/g, ""));

                        setPaymentMessage("");
                      }}
                      keyboardType="numeric"
                      placeholder={String(totalPrice)}
                      placeholderTextColor="#64748B"
                      className="mt-2 rounded-xl border border-white/10 bg-[#071A33] px-4 py-3 text-sm font-semibold text-white"
                    />

                    <Pressable
                      onPress={handleProcessPayment}
                      disabled={processingPayment}
                      className={`mt-3 items-center rounded-xl py-3 ${
                        processingPayment ? "bg-white/5" : "bg-green-600"
                      }`}
                    >
                      {processingPayment ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text className="text-xs font-bold text-white">
                          Proses Pembayaran
                        </Text>
                      )}
                    </Pressable>

                    {!!paymentMessage && (
                      <Text className="mt-2 text-center text-[10px] text-white/50">
                        {paymentMessage}
                      </Text>
                    )}
                  </View>
                )}

                {!!payment && (
                  <View className="mt-4 border-t border-white/10 pt-4">
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-white/40">
                        Total Tagihan
                      </Text>

                      <Text className="text-xs font-bold text-white">
                        {formatRupiah(totalPrice)}
                      </Text>
                    </View>

                    <View className="mt-3 flex-row justify-between">
                      <Text className="text-xs text-white/40">Dibayar</Text>

                      <Text className="text-xs font-bold text-white">
                        {formatRupiah(
                          Number(payment.payAmount ?? payment.amount ?? 0),
                        )}
                      </Text>
                    </View>

                    <View className="mt-3 flex-row justify-between">
                      <Text className="text-xs text-white/40">Kembalian</Text>

                      <Text className="text-xs font-bold text-green-400">
                        {formatRupiah(Number(payment.changeAmount || 0))}
                      </Text>
                    </View>

                    {isPaid && (
                      <>
                        <Pressable
                          onPress={() => setShowInvoice(true)}
                          className="mt-4 flex-row items-center justify-center rounded-xl bg-[#0A1224] py-3"
                        >
                          <Ionicons
                            name="receipt-outline"
                            size={17}
                            color="#FFFFFF"
                          />

                          <Text className="ml-2 text-xs font-bold text-white">
                            Lihat Invoice
                          </Text>
                        </Pressable>

                        <Text className="mt-2 text-center text-[9px] text-white/30">
                          Invoice tersedia setelah pembayaran berhasil.
                        </Text>
                      </>
                    )}
                  </View>
                )}
              </View>
            </View>

            {/* STATUS HISTORY */}

            <View className="px-5 pt-6">
              <View className="mb-3 flex-row items-end justify-between">
                <View>
                  <Text className="text-base font-extrabold text-white">
                    Status History
                  </Text>

                  <Text className="mt-1 text-[10px] text-white/40">
                    Riwayat perubahan status pesanan.
                  </Text>
                </View>

                <Text className="text-[10px] font-bold text-white/30">
                  {statusHistory.length} perubahan
                </Text>
              </View>

              <View className="overflow-hidden rounded-2xl border border-white/10 bg-[#0D2544]">
                {loadingHistory ? (
                  <View className="items-center p-8">
                    <ActivityIndicator size="small" color="#4DB5FF" />

                    <Text className="mt-3 text-xs text-white/40">
                      Memuat riwayat status...
                    </Text>
                  </View>
                ) : statusHistory.length === 0 ? (
                  <View className="p-6">
                    <Text className="text-center text-xs text-white/40">
                      Belum ada riwayat perubahan status.
                    </Text>
                  </View>
                ) : (
                  statusHistory.map((history, index) => {
                    const historyStatus =
                      history.status?.toUpperCase() || STATUS_PENDING;

                    const historyStyle =
                      STATUS_STYLE[historyStatus] ||
                      STATUS_STYLE[STATUS_PENDING];

                    const changedBy = history.changedBy?.name || "Unknown User";

                    const isFirst = index === 0;

                    const hasNext = index < statusHistory.length - 1;

                    const hasRole = Boolean(history.changedBy?.role);

                    const hasHistoryNote = Boolean(history.note);

                    return (
                      <View
                        key={history.id || `${historyStatus}-${index}`}
                        className={`flex-row p-4 ${
                          hasNext ? "border-b border-white/10" : ""
                        }`}
                      >
                        <View className="mr-3 items-center">
                          <View
                            className={`h-9 w-9 items-center justify-center rounded-xl border ${historyStyle.bg} ${historyStyle.border}`}
                          >
                            <Text
                              className={`text-[8px] font-extrabold ${historyStyle.text}`}
                            >
                              {isFirst ? "NOW" : "•"}
                            </Text>
                          </View>

                          {hasNext && (
                            <View className="mt-2 w-px flex-1 bg-white/10" />
                          )}
                        </View>

                        <View className="flex-1">
                          <View className="flex-row items-center justify-between">
                            <View
                              className={`self-start rounded-full border px-3 py-1.5 ${historyStyle.bg} ${historyStyle.border}`}
                            >
                              <Text
                                className={`text-[9px] font-extrabold ${historyStyle.text}`}
                              >
                                {STATUS_LABEL[historyStatus] || historyStatus}
                              </Text>
                            </View>

                            <Text className="ml-2 text-[9px] text-white/30">
                              {formatDateTime(history.changedAt)}
                            </Text>
                          </View>

                          <Text className="mt-2 text-xs font-semibold text-white">
                            Diubah oleh{" "}
                            <Text className="font-extrabold">{changedBy}</Text>
                          </Text>

                          {hasRole && (
                            <Text className="mt-1 text-[10px] text-white/35">
                              Role: {history.changedBy?.role}
                            </Text>
                          )}

                          {hasHistoryNote && (
                            <View className="mt-2 rounded-xl bg-white/5 px-3 py-2">
                              <Text className="text-[10px] text-white/40">
                                Catatan: {history.note}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  })
                )}
              </View>
            </View>

            {/* TOTAL */}

            <View className="mx-5 mt-6 border-t border-white/10 pt-5">
              {/* SUBTOTAL */}

              <View className="flex-row justify-between">
                <Text className="text-sm text-white/50">Subtotal</Text>

                <Text className="text-sm font-semibold text-white/80">
                  {formatRupiah(subtotal)}
                </Text>
              </View>

              {/* DISCOUNT */}

              <View className="mt-3 flex-row justify-between">
                <Text className="text-sm text-white/50">Discount Member</Text>

                <Text className="text-sm font-semibold text-red-400">
                  {discountMember > 0
                    ? `- ${formatRupiah(discountMember)}`
                    : formatRupiah(0)}
                </Text>
              </View>

              {/* TOTAL */}

              <View className="mt-4 flex-row items-center justify-between border-t border-white/10 pt-4">
                <Text className="text-base font-extrabold text-white">
                  Total
                </Text>

                <Text className="text-2xl font-extrabold text-[#4DB5FF]">
                  {formatRupiah(totalPrice)}
                </Text>
              </View>
            </View>

            {/* TUTUP */}

            <View className="px-5 pt-6">
              <Pressable
                onPress={onClose}
                className="items-center rounded-xl bg-[#0A1224] py-3.5 active:opacity-70"
              >
                <Text className="text-xs font-bold text-white">Tutup</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* INVOICE */}

      <Modal
        visible={showInvoice}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInvoice(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/70 px-5">
          <View className="max-h-[85%] w-full rounded-3xl bg-white">
            {/* INVOICE HEADER */}

            <View className="flex-row items-center justify-between border-b border-slate-100 p-5">
              <View>
                <Text className="text-lg font-extrabold text-slate-900">
                  Invoice
                </Text>

                <Text className="mt-1 text-[10px] text-slate-400">
                  {order.orderNumber || "Order"}
                </Text>
              </View>

              <Pressable
                onPress={() => setShowInvoice(false)}
                className="h-9 w-9 items-center justify-center rounded-xl bg-slate-100"
              >
                <Ionicons name="close" size={18} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                padding: 20,
              }}
            >
              {/* RESTORAN */}

              <View className="items-center border-b border-dashed border-slate-200 pb-5">
                <Text className="text-xl font-extrabold text-slate-900">
                  RESTORAN
                </Text>

                <Text className="mt-1 text-[10px] text-slate-400">
                  INVOICE PEMBAYARAN
                </Text>
              </View>

              {/* INFO */}

              <View className="py-5">
                <View className="flex-row justify-between">
                  <Text className="text-xs text-slate-400">Order</Text>

                  <Text className="text-xs font-bold text-slate-700">
                    {order.orderNumber || "Order"}
                  </Text>
                </View>

                <View className="mt-2 flex-row justify-between">
                  <Text className="text-xs text-slate-400">Customer</Text>

                  <Text className="text-xs font-bold text-slate-700">
                    {customerName}
                  </Text>
                </View>
              </View>

              {/* ITEM */}

              <View className="border-y border-slate-100 py-4">
                {orderItems.map((item, index) => {
                  const name = item.menuItem?.name || "Menu";

                  const qty = Number(item.quantity || 0);

                  const price = Number(item.price || 0);

                  return (
                    <View
                      key={item.id || `${name}-${index}`}
                      className="mb-3 flex-row justify-between"
                    >
                      <View className="flex-1">
                        <Text className="text-xs font-semibold text-slate-700">
                          {name}
                        </Text>

                        <Text className="mt-1 text-[10px] text-slate-400">
                          {qty}
                          {" × "}
                          {formatRupiah(price)}
                        </Text>
                      </View>

                      <Text className="text-xs font-bold text-slate-700">
                        {formatRupiah(qty * price)}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* TOTAL INVOICE */}

              <View className="pt-4">
                <View className="flex-row justify-between">
                  <Text className="text-xs text-slate-400">Subtotal</Text>

                  <Text className="text-xs font-semibold text-slate-700">
                    {formatRupiah(subtotal)}
                  </Text>
                </View>

                <View className="mt-2 flex-row justify-between">
                  <Text className="text-xs text-slate-400">Discount</Text>

                  <Text className="text-xs font-semibold text-red-500">
                    {discountMember > 0
                      ? `- ${formatRupiah(discountMember)}`
                      : formatRupiah(0)}
                  </Text>
                </View>

                <View className="mt-4 flex-row justify-between border-t border-slate-100 pt-4">
                  <Text className="text-sm font-extrabold text-slate-900">
                    Total
                  </Text>

                  <Text className="text-lg font-extrabold text-blue-600">
                    {formatRupiah(totalPrice)}
                  </Text>
                </View>
              </View>

              {/* PAYMENT */}

              {!!payment && (
                <View className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <Text className="mb-3 text-xs font-bold text-slate-700">
                    Pembayaran
                  </Text>

                  <View className="flex-row justify-between">
                    <Text className="text-xs text-slate-400">Metode</Text>

                    <Text className="text-xs font-bold text-slate-700">
                      {payment.method || "-"}
                    </Text>
                  </View>

                  <View className="mt-2 flex-row justify-between">
                    <Text className="text-xs text-slate-400">Dibayar</Text>

                    <Text className="text-xs font-bold text-slate-700">
                      {formatRupiah(
                        Number(payment.payAmount ?? payment.amount ?? 0),
                      )}
                    </Text>
                  </View>

                  <View className="mt-2 flex-row justify-between">
                    <Text className="text-xs text-slate-400">Kembalian</Text>

                    <Text className="text-xs font-bold text-green-600">
                      {formatRupiah(Number(payment.changeAmount || 0))}
                    </Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
