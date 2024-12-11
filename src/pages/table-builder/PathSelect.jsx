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
import { PathItem } from "./PathItem";

export function PathSelect(props) {
  const { paths, pathItems, selected, setPathItems, handleUpdate } = props;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = pathItems.indexOf(active.id);
      const newIndex = pathItems.indexOf(over.id);
      setPathItems(arrayMove(pathItems, oldIndex, newIndex));
    }
  }

  if (paths.length === 0 || !paths)
    return (
      <Container>
        <p>No paths found.</p>
      </Container>
    );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={pathItems} strategy={verticalListSortingStrategy}>
        <Container>
          {pathItems.map((id) => {
            return (
              <PathItem
                handleUpdate={handleUpdate}
                selected={selected}
                pathItems={pathItems}
                paths={paths}
                id={id}
                key={id}
              />
            );
          })}
        </Container>
      </SortableContext>
    </DndContext>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.div`
  cursor: pointer;
`;
