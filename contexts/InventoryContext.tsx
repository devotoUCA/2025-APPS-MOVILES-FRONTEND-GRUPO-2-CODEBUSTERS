// contexts/InventoryContext.tsx (CÓDIGO COMPLETO Y CORREGIDO)

import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";

export type InventoryItem = {
  id: string; // Este 'id' es el consumable_id
  type: string; // Este es el consumable_name
  quantity: number;
  image: any;
};

// 1. ✅ ¡CORRECCIÓN! Mover esta definición aquí arriba
export type InventoryContextType = {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
};

// Define el tipo para los datos del backend
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

// Define las imágenes localmente
const itemImages: Record<string, any> = {
  agua: require("../assets/Consumables/water.png"),
  polvo: require("../assets/Consumables/bone_powder.png"),
  fertilizante: require("../assets/Consumables/fertilizer.png"),
};

// Mapea los datos del backend a los del frontend
const mapBackendInventory = (items: BackendInventoryItem[]): InventoryItem[] => {
  return items.map(item => ({
    id: item.consumable_id.toString(),
    type: item.CONSUMABLES.consumable_name,
    quantity: item.quantity,
    image: itemImages[item.CONSUMABLES.consumable_name] || null
  }));
};

// 2. ✅ Ahora, cuando se usa 'InventoryContextType' aquí, ya existe
export const InventoryContext = createContext<InventoryContextType | null>(null);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Obtén el 'player' de Redux
  const { player } = useSelector((state: any) => state.auth);
  
  // Inicializa el estado
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Carga el inventario desde Redux CADA VEZ que el 'player' cambie (login/logout)
  useEffect(() => {
    if (player && player.INVENTORYs) {
      // El backend nos da el inventario, lo mapeamos a nuestro estado
      const loadedInventory = mapBackendInventory(player.INVENTORYs);
      setInventory(loadedInventory);
    } else {
      // Si no hay player (logout), resetea el inventario
      setInventory([]);
    }
  }, [player]); // Esta es la dependencia clave

  return (
    <InventoryContext.Provider value={{ inventory, setInventory }}>
      {children}
    </InventoryContext.Provider>
  );
};