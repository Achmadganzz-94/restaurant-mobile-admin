import React from "react";
import { Pressable, ScrollView, Text } from "react-native";

type Props = {
  filters: string[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
};

export default function POSOrderFilter({
  filters,
  selectedFilter,
  onFilterChange,
}: Props) {
  // Nama filter yang ditampilkan
  const getFilterLabel = (filter: string) => {
    switch (filter) {
      case "SEMUA":
        return "Semua";

      case "PREPARING":
        return "Diproses";

      case "COMPLETED":
        return "Selesai";

      case "CANCELLED":
        return "Dibatalkan";

      default:
        return filter;
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingBottom: 18,
      }}
    >
      {filters.map((filter) => {
        const active = selectedFilter === filter;

        return (
          <Pressable
            key={filter}
            onPress={() => onFilterChange(filter)}
            className={`mr-2 rounded-xl px-4 py-2.5 ${
              active ? "bg-[#168AC5]" : "border border-white/10 bg-[#0D2544]"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                active ? "text-white" : "text-white/60"
              }`}
            >
              {getFilterLabel(filter)}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
