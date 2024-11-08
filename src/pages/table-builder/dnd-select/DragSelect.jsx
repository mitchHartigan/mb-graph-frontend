import React, { useState } from "react";
import styled from "styled-components";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Item } from "./Item";

export function DragSelect() {
  const [items, setItems] = useState([1, 2, 3]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <button onClick={() => console.log("items", items)}>Log Items</button>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <SelectContainer>
          {items.map((id) => (
            <Item key={id} id={id} name={id} />
          ))}
        </SelectContainer>
      </SortableContext>
    </DndContext>
  );
}

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
