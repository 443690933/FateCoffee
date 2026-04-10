import React, { useState } from 'react';
import CoffeeForm from './components/CoffeeForm';
import CoffeeList from './components/CoffeeList';
import { useCoffeeStore } from './hooks/useCoffeeStore';

function App() {
  const [showForm, setShowForm] = useState(false);
  const { coffees } = useCoffeeStore();

  // 计算统计信息
  const totalCoffee = coffees.length;
  const totalWeight = coffees.reduce((sum, coffee) => sum + coffee.currentWeight, 0);
  const bestPeriodCoffee = coffees.filter(coffee => {
    const today = new Date();
    const roast = new Date(coffee.roastDate);
    const daysSinceRoast = Math.floor((today - roast) / (1000 * 60 * 60 * 24));
    return daysSinceRoast >= 7 && daysSinceRoast < 30;
  }).length;

  return (
    <div className="min-h-screen bg-light">
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">咖啡小记</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-accent text-dark px-4 py-2 rounded-md hover:bg-secondary transition-colors"
          >
            {showForm ? '取消' : '添加咖啡豆'}
          </button>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        {showForm && <CoffeeForm setShowForm={setShowForm} />}
        
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-secondary/20">
            <h3 className="text-sm text-gray-600 mb-1">咖啡豆种类</h3>
            <p className="text-2xl font-semibold text-primary">{totalCoffee}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-secondary/20">
            <h3 className="text-sm text-gray-600 mb-1">总剩余重量</h3>
            <p className="text-2xl font-semibold text-primary">{totalWeight}g</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-secondary/20">
            <h3 className="text-sm text-gray-600 mb-1">最佳赏味期</h3>
            <p className="text-2xl font-semibold text-primary">{bestPeriodCoffee}</p>
          </div>
        </div>
        
        <CoffeeList />
      </main>
    </div>
  );
}

export default App;