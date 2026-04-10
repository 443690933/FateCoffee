'use client';

import React, { useState, useEffect } from 'react';
import CoffeeForm from '../components/CoffeeForm';
import CoffeeList from '../components/CoffeeList';

function Home() {
  const [showForm, setShowForm] = useState(false);
  const [beans, setBeans] = useState([]);

  // 从LocalStorage加载数据
  useEffect(() => {
    const storedBeans = localStorage.getItem('coffee_beans');
    if (storedBeans) {
      try {
        setBeans(JSON.parse(storedBeans));
      } catch (error) {
        console.error('Error parsing stored beans:', error);
        localStorage.removeItem('coffee_beans');
      }
    }
  }, []);

  // 计算统计信息
  const totalCoffee = beans.length;
  const totalWeight = beans.reduce((sum, bean) => sum + bean.currentWeight, 0);
  const bestPeriodCoffee = beans.filter(bean => {
    const today = new Date();
    const roast = new Date(bean.roastDate);
    const daysSinceRoast = Math.floor((today - roast) / (1000 * 60 * 60 * 24));
    return daysSinceRoast >= 7 && daysSinceRoast < 30;
  }).length;

  // 处理添加咖啡豆
  const handleAddBean = (newBean) => {
    const newBeans = [...beans, newBean];
    setBeans(newBeans);
    localStorage.setItem('coffee_beans', JSON.stringify(newBeans));
  };

  // 处理更新咖啡豆
  const handleUpdateBean = (id, updates) => {
    const updatedBeans = beans.map(bean => 
      bean.id === id ? { ...bean, ...updates } : bean
    );
    setBeans(updatedBeans);
    localStorage.setItem('coffee_beans', JSON.stringify(updatedBeans));
  };

  // 处理删除咖啡豆
  const handleDeleteBean = (id) => {
    const updatedBeans = beans.filter(bean => bean.id !== id);
    setBeans(updatedBeans);
    localStorage.setItem('coffee_beans', JSON.stringify(updatedBeans));
  };

  return (
    <div className="min-h-screen bg-light">
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">FateCoffee</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-accent text-dark px-4 py-2 rounded-md hover:bg-secondary transition-colors"
          >
            {showForm ? '取消' : '添加咖啡豆'}
          </button>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        {showForm && <CoffeeForm setShowForm={setShowForm} onAddBean={handleAddBean} />}
        
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
        
        <CoffeeList 
          beans={beans} 
          onUpdateBean={handleUpdateBean} 
          onDeleteBean={handleDeleteBean} 
        />
      </main>
    </div>
  );
}

export default Home;