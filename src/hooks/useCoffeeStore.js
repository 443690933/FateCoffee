import { useState, useEffect } from 'react';

const COFFEE_STORAGE_KEY = 'coffee-notes-storage';

export const useCoffeeStore = () => {
  const [coffees, setCoffees] = useState([]);

  // 从LocalStorage加载数据
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Loading data from LocalStorage');
      const storedCoffees = localStorage.getItem(COFFEE_STORAGE_KEY);
      console.log('Stored coffees:', storedCoffees);
      if (storedCoffees) {
        try {
          const parsedCoffees = JSON.parse(storedCoffees);
          console.log('Parsed coffees:', parsedCoffees);
          setCoffees(parsedCoffees);
        } catch (error) {
          console.error('Error parsing stored coffees:', error);
          localStorage.removeItem(COFFEE_STORAGE_KEY);
        }
      }
    }
  }, []);

  // 保存数据到LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Saving data to LocalStorage:', coffees);
      try {
        localStorage.setItem(COFFEE_STORAGE_KEY, JSON.stringify(coffees));
        console.log('Data saved successfully');
      } catch (error) {
        console.error('Error saving data to LocalStorage:', error);
      }
    }
  }, [coffees]);

  // 添加咖啡豆
  const addCoffee = (coffee) => {
    console.log('Adding coffee:', coffee);
    setCoffees(prev => {
      const newCoffees = [...prev, coffee];
      console.log('New coffees:', newCoffees);
      return newCoffees;
    });
  };

  // 更新咖啡豆
  const updateCoffee = (id, updates) => {
    setCoffees(prev => prev.map(coffee => 
      coffee.id === id ? { ...coffee, ...updates } : coffee
    ));
  };

  // 删除咖啡豆
  const deleteCoffee = (id) => {
    setCoffees(prev => prev.filter(coffee => coffee.id !== id));
  };

  return {
    coffees,
    addCoffee,
    updateCoffee,
    deleteCoffee
  };
};