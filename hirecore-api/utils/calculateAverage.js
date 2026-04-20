const calculateAverage = (reviews) => {
  if (reviews.length === 0) return 0;

  const total = reviews.reduce((acc, r) => acc + r.rating, 0);
  return total / reviews.length;
};

module.exports = calculateAverage;
