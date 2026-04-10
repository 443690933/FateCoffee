import React, { useState } from 'react';
import { calculateCoffeeStatus, formatDate } from '../utils/coffeeUtils';

const CoffeeCard = ({ coffee, onUpdateBean, onDeleteBean }) => {
  const { daysSinceRoast, status, statusColor } = calculateCoffeeStatus(coffee.roastDate, coffee.restDays);
  
  // 状态管理：使用字符串初始化，方便输入框清空
  const [consumption, setConsumption] = useState('18');
  const [showBrewModal, setShowBrewModal] = useState(false);
  const [showRestDaysModal, setShowRestDaysModal] = useState(false);
  const [newRestDays, setNewRestDays] = useState((coffee.restDays || 7).toString());

  const handleBrew = () => {
    const amount = parseFloat(consumption); // 改用 parseFloat 支持小数
    
    // 验证：必须是数字、大于0、且不超过当前剩余量
    if (!isNaN(amount) && amount > 0 && amount <= coffee.currentWeight) {
      const newWeight = Math.max(0, coffee.currentWeight - amount);
      onUpdateBean(coffee.id, { currentWeight: newWeight });
      setShowBrewModal(false);
    } else if (amount > coffee.currentWeight) {
      alert('库存不足');
    }
  };

  const handleDelete = () => {
    if (window.confirm('确定要删除这个咖啡豆吗？')) {
      onDeleteBean(coffee.id);
    }
  };

  const handleRestDaysUpdate = () => {
    const days = parseInt(newRestDays);
    if (!isNaN(days) && days > 0) {
      onUpdateBean(coffee.id, { restDays: days });
      setShowRestDaysModal(false);
    } else {
      alert('请输入有效的养豆天数');
    }
  };

  // 计算养豆进度百分比
  const progressPercentage = Math.min(100, (daysSinceRoast / (coffee.restDays || 7)) * 100);

  // 计算剩余养豆天数
  const remainingRestDays = Math.max(0, (coffee.restDays || 7) - daysSinceRoast);

  // 辅助判断：当前输入是否合法（用于按钮禁用状态）
  const inputAmount = parseFloat(consumption);
  const isInvalid = !consumption || isNaN(inputAmount) || inputAmount <= 0 || inputAmount > coffee.currentWeight;

  // 养豆状态文本
  const getStatusText = () => {
    const restDays = coffee.restDays || 7;
    if (daysSinceRoast < restDays) {
      return `养豆中（还差 ${remainingRestDays} 天达到最佳）`;
    } else if (daysSinceRoast < 30) {
      return '最佳赏味期';
    } else {
      return '风味减退，请尽快饮用';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-secondary/20">
      <div className="flex flex-col sm:flex-row">
        {/* 左侧图片 */}
        <div className="w-full sm:w-1/3 h-40 sm:h-auto bg-gray-50 flex items-center justify-center">
          {coffee.image ? (
            <img src={coffee.image} alt={coffee.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400">无图片</span>
          )}
        </div>
        
        {/* 右侧内容 */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-primary">{coffee.name}</h3>
              <p className="text-sm text-gray-600">{coffee.brand}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {status}
            </span>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">剩余重量</span>
              <span className={`font-medium ${coffee.currentWeight < 20 ? 'text-red-500' : ''}`}>
                {coffee.currentWeight}g
              </span>
            </div>
          </div>

          {/* 养豆进度条 */}
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">养豆状态</span>
                <button
                  onClick={() => setShowRestDaysModal(true)}
                  className="text-primary hover:underline text-xs"
                >
                  编辑
                </button>
              </div>
              <span className="font-medium">{getStatusText()}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ease-in-out ${daysSinceRoast < (coffee.restDays || 7) ? 'bg-gray-400' : daysSinceRoast < 30 ? 'bg-green-400' : 'bg-yellow-400'}`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* 操作区域 */}
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => setShowBrewModal(true)}
              className="flex-1 px-4 py-2 bg-accent text-dark rounded-md hover:bg-secondary transition-colors text-sm font-medium"
            >
              消耗豆量
            </button>

            <button
              onClick={handleDelete}
              className="px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm"
            >
              删除
            </button>
          </div>
        </div>
      </div>

      {/* 冲煮弹窗 */}
      {showBrewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-primary">冲煮记录</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">消耗克数</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={consumption}
                    onChange={(e) => setConsumption(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="输入克数"
                  />
                  <span className="absolute right-3 top-2 text-gray-400">g</span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowBrewModal(false)}
                  className="px-4 py-2 border border-secondary rounded-md hover:bg-secondary transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleBrew}
                  disabled={isInvalid}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 编辑养豆天数弹窗 */}
      {showRestDaysModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-primary">编辑养豆天数</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">养豆建议天数</label>
                <div className="relative">
                  <input
                    type="number"
                    value={newRestDays}
                    onChange={(e) => setNewRestDays(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="输入天数"
                    min="1"
                  />
                  <span className="absolute right-3 top-2 text-gray-400">天</span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowRestDaysModal(false)}
                  className="px-4 py-2 border border-secondary rounded-md hover:bg-secondary transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleRestDaysUpdate}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-dark transition-colors"
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoffeeCard;