import React, { useState } from 'react';

const CoffeeForm = ({ setShowForm, onAddBean }) => {
  // 设置默认值，烘焙日期为今天
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    brand: '',
    name: '',
    roastDate: today,
    roastLevel: '中',
    restDays: 7,
    initialWeight: '',
    currentWeight: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 当输入初始重量时，自动填充剩余重量
    if (name === 'initialWeight') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        currentWeight: value // 自动填充剩余重量
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    
    // 验证表单数据
    const isValid = formData.brand.trim() !== '' && 
                    formData.name.trim() !== '' && 
                    formData.roastDate !== '' && 
                    formData.initialWeight !== '' && 
                    formData.currentWeight !== '';
    
    console.log('Validation:', isValid);
    
    if (isValid) {
      const coffeeData = {
        ...formData,
        id: Date.now().toString(),
        currentWeight: parseInt(formData.currentWeight),
        initialWeight: parseInt(formData.initialWeight),
        restDays: parseInt(formData.restDays)
      };
      
      console.log('Adding coffee data:', coffeeData);
      onAddBean(coffeeData);
      console.log('Coffee added successfully');
      setShowForm(false);
    } else {
      console.log('Form validation failed. Please check all fields.');
      // 显示错误提示
      alert('请填写所有必填字段');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-primary">添加咖啡豆</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">品牌名称</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">咖啡豆名称</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">烘焙日期</label>
              <input
                type="date"
                name="roastDate"
                value={formData.roastDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">烘焙程度</label>
              <select
                name="roastLevel"
                value={formData.roastLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="浅">浅</option>
                <option value="中">中</option>
                <option value="深">深</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">养豆建议天数</label>
              <input
                type="number"
                name="restDays"
                value={formData.restDays}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">咖啡豆照片</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">初始重量 (克)</label>
              <input
                type="number"
                name="initialWeight"
                value={formData.initialWeight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">剩余重量 (克)</label>
              <input
                type="number"
                name="currentWeight"
                value={formData.currentWeight}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                min="0"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-secondary rounded-md hover:bg-secondary transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-dark transition-colors"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CoffeeForm;