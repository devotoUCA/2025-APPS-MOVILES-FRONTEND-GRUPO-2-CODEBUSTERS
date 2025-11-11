import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export type InventoryItem = {
  id: string; 
  type: string; 
  quantity: number;
  image: any;
};

export type InventoryContextType = {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
};

type BackendInventoryItem = {
  player_id: number;
  consumable_id: number;
  quantity: number;
  CONSUMABLES: {
    consumable_id: number;
    consumable_name: string; // ej: "agua"
    consumable_img: string | null;
  }
}

const itemImages: Record<string, any> = {
  agua: require("../assets/Consumables/water.png"),
  polvo: require("../assets/Consumables/bone_powder.png"),
  fertilizante: require("../assets/Consumables/fertilizer.png"),
};

const mapBackendInventory = (items: BackendInventoryItem[]): InventoryItem[] => {
  return items.map(item => ({
    id: item.consumable_id.toString(),
    type: item.CONSUMABLES.consumable_name,
    quantity: item.quantity,
    image: itemImages[item.CONSUMABLES.consumable_name] || null
  }));
};

export const InventoryContext = createContext<InventoryContextType | null>(null);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { player } = useSelector((state: any) => state.auth);
  
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    if (player && player.INVENTORYs) {
      const loadedInventory = mapBackendInventory(player.INVENTORYs);
      setInventory(loadedInventory);
    } else {
      setInventory([]);
    }
  }, [player]); 

  return (
    <InventoryContext.Provider value={{ inventory, setInventory }}>
      {children}
    </InventoryContext.Provider>
  );
};