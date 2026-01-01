import { useState } from 'react';
import { HabitProvider } from './context/HabitContext';
import { useHabits } from './hooks/useHabits';
import { Header } from './components/layout/Header';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './views/Dashboard';
import { Modal } from './components/common/Modal';
import { HabitForm, type HabitFormData } from './components/habits/HabitForm';
import './App.css';

const AppContent = () => {
  const { addHabit } = useHabits();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleCreateHabit = (data: HabitFormData) => {
    addHabit(data);
    setIsAddModalOpen(false);
  };

  return (
    <Layout
      header={<Header onAddClick={() => setIsAddModalOpen(true)} />}
    >
      <Dashboard />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Criar Novo Hábito"
        size="md"
      >
        <HabitForm
          onSubmit={handleCreateHabit}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </Layout>
  );
};

function App() {
  return (
    <HabitProvider>
      <AppContent />
    </HabitProvider>
  );
}

export default App;
