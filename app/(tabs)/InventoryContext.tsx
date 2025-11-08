import React, { createContext, ReactNode, useState } from "react";

export type InventoryItem = {
  id: string;
  type: string;
  quantity: number;
  image: any;
};

type InventoryContextType = {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
};

export const InventoryContext = createContext<InventoryContextType | null>(null);

const initialInventory: InventoryItem[] = [
  { id: "1", type: "agua", quantity: 6, image: require("../../assets/Consumables/water.png") },
  { id: "2", type: "polvo", quantity: 6, image: require("../../assets/Consumables/bone_powder.png") },
  { id: "3", type: "fertilizante", quantity: 6, image: require("../../assets/Consumables/fertilizer.png") },
];

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState(initialInventory);

  return (
    <InventoryContext.Provider value={{ inventory, setInventory }}>
      {children}
    </InventoryContext.Provider>
  );
};
