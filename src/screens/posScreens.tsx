import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { api } from "../config/Api";

import POSHeader from "../components/posUi/headerPos";
import POSSearch from "../components/posUi/SearchPos";
import POSCategories from "../components/posUi/KategoriPos";
import POSMenuList from "../components/posUi/posMenu";

import FloatingCart from "../components/posUi/floatingCard";
import CartPos from "../components/posUi/cartPos";

import POSOrderStats from "../components/posUi/posOrder";
import POSOrderFilter from "../components/posUi/filterPos";
import POSOrderList from "../components/posUi/ListorderPos";

import CheckoutPos from "../components/posUi/CheckoutPos";
import POSOrderDetail from "../components/posUi/POSOrderDetail";

/* =========================
   MENU
========================= */

type Menu = {
  id: string;
  name: string;
  category: string;
  price: number;

  imageUrl?: string;

  isAvailable?: boolean;
  available?: boolean;
  isActive?: boolean;
};

/* =========================
   CART
========================= */

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;

  imageUrl?: string;
};

/* =========================
   ORDER ITEM
========================= */

type OrderItem = {
  id?: string;

  quantity?: number;
  price?: number;

  menuItem?: {
    name?: string;
    price?: number;
  };

  menu?: {
    name?: string;
    price?: number;
  };

  name?: string;
};

/* =========================
   PAYMENT
========================= */

type Payment = {
  amount?: number;
  method?: string;
  status?: string;

  payAmount?: number;
  changeAmount?: number;
};

/* =========================
   ORDER
========================= */

type Order = {
  id?: string;
  orderNumber?: string;

  customer?: {
    name?: string;
    phone?: string;
  };

  customerName?: string;

  orderType?: string;

  tableNumber?: string | number;

  totalPrice?: number;

  status?: string;

  paymentStatus?: string;

  createdAt?: string;

  items?: OrderItem[];

  orderItems?: OrderItem[];

  note?: string;

  subtotal?: number;

  tax?: number;

  serviceCharge?: number;

  discountMember?: number;

  payment?: Payment;
};

/* =========================
   PROPS
========================= */

type Props = {
  token: string;
};

/* =========================
   CONSTANT
========================= */

const ALL_CATEGORY = "SEMUA";

const ORDER_FILTERS = [
  "SEMUA",
  "PENDING",
  "PREPARING",
  "READY",
  "SERVED",
  "COMPLETED",
  "CANCELLED",
];

const ORDERS_PER_PAGE = 5;

/* =========================
   SCREEN
========================= */

export default function POSScreens({ token }: Props) {
  /* =========================
     DATA
  ========================= */

  const [menus, setMenus] = useState<Menu[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);

  /* =========================
     SELECTED ORDER
  ========================= */

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  /* =========================
     CHECKOUT
  ========================= */

  const [checkoutVisible, setCheckoutVisible] = useState(false);

  /* =========================
     CART
  ========================= */

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [cartVisible, setCartVisible] = useState(false);

  /* =========================
     LOADING
  ========================= */

  const [loading, setLoading] = useState(true);

  /* =========================
     SEARCH
  ========================= */

  const [search, setSearch] = useState("");

  /* =========================
     CATEGORY
  ========================= */

  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);

  /* =========================
     ORDER FILTER
  ========================= */

  const [selectedOrderFilter, setSelectedOrderFilter] = useState("SEMUA");

  /* =========================
     PAGINATION
  ========================= */

  const [currentPage, setCurrentPage] = useState(1);

  /* =========================
     FORMAT RUPIAH
  ========================= */

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  /* =========================
     FETCH DATA
  ========================= */

  const fetchData = async () => {
    try {
      console.log("TOKEN POS:", token);

      const [menuResponse, orderResponse] = await Promise.all([
        api.get("/menu", {
          params: {
            page: 1,
            limit: 50,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        api.get("/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const menuData: Menu[] = menuResponse.data?.data || [];

      const orderData: Order[] = orderResponse.data?.data || [];

      console.log(
        "POS MENU IMAGE:",
        menuData.map((menu: Menu) => ({
          name: menu.name,
          imageUrl: menu.imageUrl,
        })),
      );

      console.log("POS ORDERS:", orderData);

      setMenus(menuData);
      setOrders(orderData);
    } catch (error: any) {
      console.log("POS FETCH ERROR:", error);

      if (error?.response) {
        console.log("POS ERROR STATUS:", error.response.status);

        console.log("POS ERROR DATA:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     INITIAL FETCH
  ========================= */

  useEffect(() => {
    if (!token) {
      console.log("TOKEN POS KOSONG");

      setLoading(false);

      return;
    }

    fetchData();
  }, [token]);

  /* =========================
     ADD TO CART
  ========================= */

  const handleAddToCart = (menu: Menu) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === menu.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === menu.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          id: menu.id,
          name: menu.name,
          price: menu.price,
          quantity: 1,
          imageUrl: menu.imageUrl,
        },
      ];
    });
  };

  /* =========================
     INCREASE QUANTITY
  ========================= */

  const handleIncreaseQuantity = (id: string) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      ),
    );
  };

  /* =========================
     DECREASE QUANTITY
  ========================= */

  const handleDecreaseQuantity = (id: string) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  /* =========================
     REMOVE CART ITEM
  ========================= */

  const handleRemoveFromCart = (id: string) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    );
  };

  /* =========================
     TOTAL CART ITEMS
  ========================= */

  const totalCartItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  /* =========================
     TOTAL CART PRICE
  ========================= */

  const totalCartPrice = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, [cartItems]);

  /* =========================
     CATEGORIES
  ========================= */

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(menus.map((menu) => menu.category).filter(Boolean)),
    );

    return [ALL_CATEGORY, ...uniqueCategories];
  }, [menus]);

  /* =========================
     FILTER MENU
  ========================= */

  const filteredMenus = useMemo(() => {
    const searchValue = search.toLowerCase();

    return menus.filter((menu) => {
      const menuName = menu.name.toLowerCase();

      const matchSearch = menuName.includes(searchValue);

      const matchCategory =
        selectedCategory === ALL_CATEGORY || menu.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [menus, search, selectedCategory]);

  /* =========================
     FILTER ORDER
  ========================= */

  const filteredOrders = useMemo(() => {
    if (selectedOrderFilter === "SEMUA") {
      return orders;
    }

    return orders.filter(
      (order) => order.status?.toUpperCase() === selectedOrderFilter,
    );
  }, [orders, selectedOrderFilter]);

  /* =========================
     TOTAL PAGE
  ========================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ORDERS_PER_PAGE),
  );

  /* =========================
     PAGINATED ORDERS
  ========================= */

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ORDERS_PER_PAGE;

    const end = start + ORDERS_PER_PAGE;

    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage]);

  /* =========================
     RESET PAGE
  ========================= */

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, selectedOrderFilter]);

  /* =========================
     SELECT ORDER
  ========================= */

  const handleOrderPress = (order: Order) => {
    console.log("ORDER DIPILIH:", order);

    setSelectedOrder(order);
  };

  /* =========================
     UPDATE ORDER
  ========================= */

  const handleOrderUpdated = (updatedOrder: Order) => {
    console.log("ORDER UPDATED:", updatedOrder);

    setSelectedOrder(updatedOrder);

    setOrders((currentOrders) =>
      currentOrders.map((currentOrder) =>
        currentOrder.id === updatedOrder.id ? updatedOrder : currentOrder,
      ),
    );
  };

  /* =========================
     ORDER STATISTICS
  ========================= */

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status?.toUpperCase() === "PENDING",
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status?.toUpperCase() === "PREPARING",
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status?.toUpperCase() === "COMPLETED",
  ).length;

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-[#071A33]">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4DB5FF" />

          <Text className="mt-3 text-sm text-white/50">Memuat data POS...</Text>
        </View>
      </SafeAreaView>
    );
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#071A33]">
      <View className="flex-1">
        {/* =========================
            MAIN SCROLL
        ========================= */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 120,
          }}
        >
          {/* HEADER */}

          <POSHeader />

          {/* SEARCH */}

          <POSSearch search={search} onSearchChange={setSearch} />

          {/* CATEGORIES */}

          <POSCategories
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* MENU */}

          <POSMenuList
            menus={filteredMenus}
            formatRupiah={formatRupiah}
            onAddToCart={handleAddToCart}
          />

          {/* ORDER STATS */}

          <POSOrderStats
            totalOrders={totalOrders}
            pendingOrders={pendingOrders}
            processingOrders={processingOrders}
            completedOrders={completedOrders}
          />

          {/* ORDER FILTER */}

          <POSOrderFilter
            filters={ORDER_FILTERS}
            selectedFilter={selectedOrderFilter}
            onFilterChange={setSelectedOrderFilter}
          />

          {/* ORDER LIST */}

          <POSOrderList
            orders={paginatedOrders}
            formatRupiah={formatRupiah}
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={() => {
              setCurrentPage((page) => Math.max(page - 1, 1));
            }}
            onNext={() => {
              setCurrentPage((page) => Math.min(page + 1, totalPages));
            }}
            onOrderPress={handleOrderPress}
          />
        </ScrollView>

        {/* =========================
            FLOATING CART
        ========================= */}

        <FloatingCart
          totalItems={totalCartItems}
          totalPrice={totalCartPrice}
          formatRupiah={formatRupiah}
          onPress={() => setCartVisible(true)}
        />

        {/* =========================
            CART
        ========================= */}

        <CartPos
          visible={cartVisible}
          items={cartItems}
          formatRupiah={formatRupiah}
          onClose={() => setCartVisible(false)}
          onIncrease={handleIncreaseQuantity}
          onDecrease={handleDecreaseQuantity}
          onRemove={handleRemoveFromCart}
          onCheckout={() => {
            setCartVisible(false);

            setCheckoutVisible(true);
          }}
        />

        {/* =========================
            CHECKOUT
        ========================= */}

        <CheckoutPos
          visible={checkoutVisible}
          items={cartItems}
          formatRupiah={formatRupiah}
          onClose={() => setCheckoutVisible(false)}
          onSubmit={async (data) => {
            try {
              console.log("CHECKOUT DATA:", data);

              const response = await api.post(
                "/orders",
                {
                  tableNumber: data.tableNumber,

                  orderType: data.orderType,

                  customerId: data.customerId || undefined,

                  items: cartItems.map((item) => ({
                    menuItemId: item.id,

                    quantity: item.quantity,
                  })),
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              console.log("ORDER BERHASIL:", response.data);

              setCheckoutVisible(false);

              setCartItems([]);

              await fetchData();
            } catch (error: any) {
              console.log("CHECKOUT ERROR:", error);

              if (error?.response) {
                console.log("CHECKOUT STATUS:", error.response.status);

                console.log("CHECKOUT RESPONSE:", error.response.data);
              }
            }
          }}
        />

        {/* =========================
            ORDER DETAIL
        ========================= */}

        <POSOrderDetail
          visible={selectedOrder !== null}
          order={selectedOrder}
          token={token}
          formatRupiah={formatRupiah}
          onClose={() => {
            setSelectedOrder(null);
          }}
          onOrderUpdated={handleOrderUpdated}
        />
      </View>
    </SafeAreaView>
  );
}
