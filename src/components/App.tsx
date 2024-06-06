import React, { useState } from "react";
import { Provider, defaultTheme } from "@adobe/react-spectrum";
import { Pill } from "./Pill";
import { DropZone } from "./DropZone";
import { CombinedPool } from "./CombinedPool";
import { v4 as uuidv4 } from "uuid"; // Add this line for generating unique IDs

interface Pill {
  id: string;
  label: string;
}

interface CombinedPool {
  datasets: Pill[];
}

function App() {
  const [pills, setPills] = useState<Pill[]>([
    { id: "1", label: "BHLD 2019-2" },
    { id: "2", label: "BHLD 2020-1" },
    { id: "3", label: "BHLD 2020-3" },
    { id: "4", label: "BANANA_ASSET" },
    { id: "5", label: "APPLE_LOAN" },
    { id: "6", label: "Cucumber_Mortgages" },
  ]);

  const [combinedPools, setCombinedPools] = useState<{
    [key: string]: CombinedPool;
  }>({});

  const handleDrop = (items: Pill[]) => {
    const newPills = items.map((item) => ({ id: item.id, label: item.label }));
    setPills((prevPills) => {
      const updatedPills = [...prevPills];
      newPills.forEach((newPill) => {
        if (!updatedPills.some((pill) => pill.id === newPill.id)) {
          updatedPills.push(newPill);
        }
      });
      return updatedPills;
    });

    const newCombinedPools = { ...combinedPools };
    Object.keys(newCombinedPools).forEach((poolId) => {
      newCombinedPools[poolId].datasets = newCombinedPools[
        poolId
      ].datasets.filter(
        (pill) => !newPills.find((newPill) => newPill.id === pill.id)
      );
    });
    setCombinedPools(newCombinedPools);
  };

  const handleDropIntoCombined = (items: Pill[], poolId: string) => {
    const newPills = items.map((item) => ({ id: item.id, label: item.label }));
    setCombinedPools((prevPools) => {
      const updatedPools = { ...prevPools };
      if (!updatedPools[poolId]) {
        updatedPools[poolId] = { datasets: [] };
      }
      newPills.forEach((newPill) => {
        if (
          !updatedPools[poolId].datasets.some((pill) => pill.id === newPill.id)
        ) {
          updatedPools[poolId].datasets.push(newPill);
        }
      });
      return updatedPools;
    });

    setPills((prevPills) =>
      prevPills.filter(
        (pill) => !newPills.find((newPill) => newPill.id === pill.id)
      )
    );
  };

  const handleCombine = (targetId: string, sourceId: string) => {
    const targetPill = pills.find((pill) => pill.id === targetId);
    const sourcePill = pills.find((pill) => pill.id === sourceId);
    if (targetPill && sourcePill) {
      const newPoolId = uuidv4();
      setCombinedPools((prevPools) => ({
        ...prevPools,
        [newPoolId]: { datasets: [targetPill, sourcePill] },
      }));

      setPills((prevPills) =>
        prevPills.filter((pill) => pill.id !== targetId && pill.id !== sourceId)
      );
    }
  };

  const handleDragOut = (id: string, poolId: string) => {
    setPills((prevPills) => {
      const updatedPills = [...prevPills];
      const draggedPill = combinedPools[poolId]?.datasets.find(
        (pill) => pill.id === id
      );
      if (draggedPill && !updatedPills.some((pill) => pill.id === id)) {
        updatedPills.push(draggedPill);
      }
      return updatedPills;
    });

    setCombinedPools((prevPools) => {
      const updatedPools = { ...prevPools };
      if (updatedPools[poolId]) {
        updatedPools[poolId].datasets = updatedPools[poolId].datasets.filter(
          (pill) => pill.id !== id
        );
        if (updatedPools[poolId].datasets.length === 0) {
          delete updatedPools[poolId];
        }
      }
      return updatedPools;
    });
  };

  return (
    <Provider theme={defaultTheme}>
      <div style={{ padding: "16px" }}>
        <h1>Pool Selector</h1>
        <DropZone onDrop={handleDrop}>
          {pills.map((pill) => (
            <Pill
              key={pill.id}
              id={pill.id}
              label={pill.label}
              onCombine={handleCombine}
            />
          ))}
        </DropZone>
        {Object.keys(combinedPools).map((poolId) => (
          <CombinedPool
            key={poolId}
            poolId={poolId}
            onDragOut={(id) => handleDragOut(id, poolId)}
            onDrop={(items) => handleDropIntoCombined(items, poolId)}
          >
            {combinedPools[poolId].datasets.map((pill) => (
              <Pill
                key={pill.id}
                id={pill.id}
                label={pill.label}
                onCombine={handleCombine}
                onDragOut={(id) => handleDragOut(id, poolId)}
              />
            ))}
          </CombinedPool>
        ))}
      </div>
    </Provider>
  );
}

export default App;
