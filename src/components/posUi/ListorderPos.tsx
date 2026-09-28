import React from "react";
import { Pressable, Text, View } from "react-native";

type Order = {
  id?: string;
  orderNumber?: string;

  customer?: {
    name?: string;
  };

  customerName?: string;

  orderType?: string;
  tableNumber?: string | number;

  totalPrice?: number;

  status?: string;
  paymentStatus?: string;

  createdAt?: string;
};

type Props = {
  orders: Order[];
  formatRupiah: (value: number) => string;

  currentPage: number;
  totalPages: number;

  onPrevious: () => void;
  onNext: () => void;

  onOrderPress: (order: Order) => void;
};

/* =========================
   STATUS
========================= */

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Menunggu",
  PREPARING: "Diproses",
  READY: "Siap",
  SERVED: "Disajikan",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const STATUS_STYLE: Record<
  string,
  {
    bg: string;
    text: string;
  }
> = {
  PENDING: {
    bg: "bg-yellow-500/15",
    text: "text-yellow-400",
  },

  PREPARING: {
    bg: "bg-blue-500/15",
    text: "text-blue-400",
  },

  READY: {
    bg: "bg-cyan-500/15",
    text: "text-cyan-400",
  },

  SERVED: {
    bg: "bg-purple-500/15",
    text: "text-purple-400",
  },

  COMPLETED: {
    bg: "bg-green-500/15",
    text: "text-green-400",
  },

  CANCELLED: {
    bg: "bg-red-500/15",
    text: "text-red-400",
  },
};

/* =========================
   PAYMENT
========================= */

const PAYMENT_LABEL: Record<string, string> = {
  UNPAID: "Belum Bayar",
  PAID: "Lunas",
  PENDING: "Menunggu",
};

const PAYMENT_STYLE: Record<
  string,
  {
    bg: string;
    text: string;
  }
> = {
  UNPAID: {
    bg: "bg-red-500/10",
    text: "text-red-400",
  },

  PAID: {
    bg: "bg-green-500/10",
    text: "text-green-400",
  },

  PENDING: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
  },
};

/* =========================
   ORDER TYPE
========================= */

const ORDER_TYPE_LABEL: Record<string, string> = {
  DINE_IN: "Dine In",
  TAKEAWAY: "Takeaway",
  DELIVERY: "Delivery",
};

/* =========================
   DEFAULT VALUE
========================= */

const DEFAULT_STATUS = "PENDING";
const DEFAULT_PAYMENT_STATUS = "UNPAID";
const DEFAULT_CUSTOMER = "Pelanggan";
const DEFAULT_ORDER_TYPE = "-";
const DEFAULT_ORDER_NUMBER = "Order";
const EMPTY_VALUE = "";
const DATE_SEPARATOR = " • ";

/* =========================
   DATE FORMAT
========================= */

const formatDate = (date?: string) => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* =========================
   TIME FORMAT
========================= */

const formatTime = (date?: string) => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* =========================
   COMPONENT
========================= */

export default function POSOrderList({
  orders,
  formatRupiah,
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onOrderPress,
}: Props) {
  return (
    <View className="px-4 pb-5">
      {/* =========================
          TITLE
      ========================= */}

      <View className="mb-4">
        <Text className="text-lg font-bold text-white">Daftar Pesanan</Text>

        <Text className="mt-1 text-xs text-white/40">
          Tekan pesanan untuk melihat detail
        </Text>
      </View>

      {/* =========================
          EMPTY STATE
      ========================= */}

      {orders.length === 0 ? (
        <View className="items-center rounded-2xl border border-white/10 bg-[#0D2544] px-5 py-10">
          <Text className="text-sm font-medium text-white/70">
            Belum ada pesanan
          </Text>

          <Text className="mt-1 text-xs text-white/40">
            Pesanan akan muncul di sini
          </Text>
        </View>
      ) : (
        /* =========================
           ORDER LIST
        ========================= */

        <View>
          {orders.map((order, index) => {
            const status = order.status?.toUpperCase() || DEFAULT_STATUS;

            const paymentStatus =
              order.paymentStatus?.toUpperCase() || DEFAULT_PAYMENT_STATUS;

            const statusStyle =
              STATUS_STYLE[status] || STATUS_STYLE[DEFAULT_STATUS];

            const paymentStyle =
              PAYMENT_STYLE[paymentStatus] ||
              PAYMENT_STYLE[DEFAULT_PAYMENT_STATUS];

            const customerName =
              order.customer?.name || order.customerName || DEFAULT_CUSTOMER;

            const typeKey = order.orderType?.toUpperCase() || EMPTY_VALUE;

            const orderType =
              ORDER_TYPE_LABEL[typeKey] ||
              order.orderType ||
              DEFAULT_ORDER_TYPE;

            return (
              <Pressable
                key={order.id || order.orderNumber || index}
                onPress={() => onOrderPress(order)}
                className="mb-3 rounded-2xl border border-white/10 bg-[#0D2544] p-4 active:opacity-80"
              >
                {/* =========================
                    HEADER ORDER
                ========================= */}

                <View className="mb-3 flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-white">
                      {order.orderNumber || DEFAULT_ORDER_NUMBER}
                    </Text>

                    <Text className="mt-1 text-xs text-white/40">
                      {formatDate(order.createdAt)}

                      {DATE_SEPARATOR}

                      {formatTime(order.createdAt)}
                    </Text>
                  </View>

                  {/* STATUS */}

                  <View className={`rounded-full px-3 py-1 ${statusStyle.bg}`}>
                    <Text
                      className={`text-[10px] font-semibold ${statusStyle.text}`}
                    >
                      {STATUS_LABEL[status] || status}
                    </Text>
                  </View>
                </View>

                {/* =========================
                    CUSTOMER
                ========================= */}

                <View className="mb-3">
                  <Text className="text-[10px] uppercase tracking-wide text-white/35">
                    Pelanggan
                  </Text>

                  <Text className="mt-1 text-sm font-medium text-white/80">
                    {customerName}
                  </Text>
                </View>

                {/* =========================
                    ORDER INFORMATION
                ========================= */}

                <View className="mb-3 flex-row">
                  {/* TYPE */}

                  <View className="flex-1">
                    <Text className="text-[10px] uppercase tracking-wide text-white/35">
                      Tipe
                    </Text>

                    <Text className="mt-1 text-xs text-white/70">
                      {orderType}
                    </Text>
                  </View>

                  {/* TABLE */}

                  <View className="flex-1">
                    <Text className="text-[10px] uppercase tracking-wide text-white/35">
                      Meja
                    </Text>

                    <Text className="mt-1 text-xs text-white/70">
                      {order.tableNumber || "-"}
                    </Text>
                  </View>
                </View>

                {/* =========================
                    TOTAL + PAYMENT
                ========================= */}

                <View className="flex-row items-end justify-between border-t border-white/10 pt-3">
                  {/* PAYMENT */}

                  <View>
                    <Text className="text-[10px] uppercase tracking-wide text-white/35">
                      Pembayaran
                    </Text>

                    <View
                      className={`mt-1 self-start rounded-full px-2.5 py-1 ${paymentStyle.bg}`}
                    >
                      <Text
                        className={`text-[10px] font-medium ${paymentStyle.text}`}
                      >
                        {PAYMENT_LABEL[paymentStatus] || paymentStatus}
                      </Text>
                    </View>
                  </View>

                  {/* TOTAL */}

                  <View className="items-end">
                    <Text className="text-[10px] uppercase tracking-wide text-white/35">
                      Total
                    </Text>

                    <Text className="mt-1 text-base font-bold text-white">
                      {formatRupiah(order.totalPrice || 0)}
                    </Text>
                  </View>
                </View>

                {/* =========================
                    DETAIL INDICATOR
                ========================= */}

                <View className="mt-3 items-center">
                  <Text className="text-[10px] font-medium text-[#4DB5FF]">
                    Lihat detail pesanan →
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* =========================
          PAGINATION
      ========================= */}

      {orders.length > 0 && (
        <View className="mt-2 flex-row items-center justify-between">
          {/* PREVIOUS */}

          <Pressable
            onPress={onPrevious}
            disabled={currentPage <= 1}
            className={`rounded-xl border border-white/10 px-4 py-2.5 ${
              currentPage <= 1
                ? "bg-white/5 opacity-40"
                : "bg-[#0D2544] active:opacity-70"
            }`}
          >
            <Text className="text-xs font-medium text-white">← Sebelumnya</Text>
          </Pressable>

          {/* PAGE */}

          <Text className="text-xs text-white/50">
            {currentPage} / {totalPages}
          </Text>

          {/* NEXT */}

          <Pressable
            onPress={onNext}
            disabled={currentPage >= totalPages}
            className={`rounded-xl border border-white/10 px-4 py-2.5 ${
              currentPage >= totalPages
                ? "bg-white/5 opacity-40"
                : "bg-[#0D2544] active:opacity-70"
            }`}
          >
            <Text className="text-xs font-medium text-white">Berikutnya →</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
