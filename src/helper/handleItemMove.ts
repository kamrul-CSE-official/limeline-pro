import { IItem } from "@/interface/items";

export const handleItemMove = (
  itemId: number,
  dragTime: number,
  newGroupOrder: number,
  groups: { id: number }[],
  setItems: React.Dispatch<React.SetStateAction<IItem[]>>
) => {
  const storedItems = JSON.parse(localStorage.getItem("items") || "[]");

  const updatedItems = storedItems.map((item: IItem) => {
    if (item.id === itemId) {
      const deltaTime = dragTime - item.start_time;
      return {
        ...item,
        start_time: dragTime,
        end_time: item.end_time + deltaTime,
        group: groups[newGroupOrder].id,
      };
    }
    return item;
  });

  // Update localStorage and state
  localStorage.setItem("items", JSON.stringify(updatedItems));
  setItems(updatedItems);
};
