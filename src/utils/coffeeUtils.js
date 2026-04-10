// 计算咖啡豆状态
export const calculateCoffeeStatus = (roastDate, restDays = 7) => {
  const today = new Date();
  const roast = new Date(roastDate);
  const timeDiff = today - roast;
  const daysSinceRoast = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  let status, statusColor;

  if (daysSinceRoast < restDays) {
    status = '养豆中';
    statusColor = 'bg-gray-100 text-gray-800';
  } else if (daysSinceRoast < 30) {
    status = '最佳赏味期';
    statusColor = 'bg-green-100 text-green-800';
  } else {
    status = '请尽快饮用';
    statusColor = 'bg-orange-100 text-orange-800';
  }

  return {
    daysSinceRoast,
    status,
    statusColor
  };
};

// 格式化日期
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};