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
import { LabelItem } from "./LabelItem";

export function LabelSelect(props) {
  const { labels, setLabels, selected, handleUpdate } = props;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    console.log({ active, over });

    if (active.id !== over.id) {
      const oldIndex = labels.indexOf(active.id);
      const newIndex = labels.indexOf(over.id);
      setLabels(arrayMove(labels, oldIndex, newIndex));
    }
  }

  if (labels.length === 0 || !labels)
    return (
      <Container>
        <p>No types found.</p>
      </Container>
    );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={labels} strategy={verticalListSortingStrategy}>
        <Container>
          {labels.map((label) => {
            return (
              <LabelItem
                handleUpdate={handleUpdate}
                selected={selected}
                labels={labels}
                value={label}
                key={label}
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
