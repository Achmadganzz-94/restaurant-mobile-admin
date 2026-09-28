import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

type Props = {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
};

export default function POSCategories({
  categories,
  selectedCategory,
  onCategoryChange,
}: Props) {
  return (
    <View className="mt-5">
      <View className="mb-3 flex-row items-center justify-between px-5">
        <Text className="text-lg font-bold text-white">Kategori</Text>

        <Pressable>
          <Text className="text-xs font-semibold text-[#4DB5FF]">
            Lihat Semua
          </Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
      >
        {categories.map((category) => {
          const active = selectedCategory === category;

          return (
            <Pressable
              key={category}
              onPress={() => onCategoryChange(category)}
              className={`mr-3 rounded-xl px-5 py-3 ${
                active ? "bg-[#168AC5]" : "border border-white/10 bg-[#0D2544]"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  active ? "text-white" : "text-white/60"
                }`}
              >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
