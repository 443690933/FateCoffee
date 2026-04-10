import React from 'react';
import CoffeeCard from './CoffeeCard';

const CoffeeList = ({ beans, onUpdateBean, onDeleteBean }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-primary">咖啡豆库存</h2>
      {beans.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">暂无咖啡豆库存</p>
          <p className="text-sm text-gray-500 mt-2">点击"添加咖啡豆"按钮开始管理您的咖啡豆</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {beans.map(bean => (
            <CoffeeCard 
              key={bean.id} 
              coffee={bean} 
              onUpdateBean={onUpdateBean} 
              onDeleteBean={onDeleteBean} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoffeeList;