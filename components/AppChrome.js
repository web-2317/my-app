"use client";

import { useState } from "react";
import BottomNav from "./BottomNav";
import Modal from "./Modal";
import DeadlineForm from "./DeadlineForm";
import { notifyDeadlinesChanged } from "@/lib/useDeadlinesChanged";

export default function AppChrome({ children }) {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <div className="pb-24">{children}</div>
      <BottomNav onAddClick={() => setShowAdd(true)} />
      {showAdd && (
        <Modal title="締め切りを追加" onClose={() => setShowAdd(false)}>
          <DeadlineForm
            onSave={() => {
              setShowAdd(false);
              notifyDeadlinesChanged();
            }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}
    </>
  );
}
