const checkRating = (course) => {
    const reviw = course.review;
    const totalreviw = reviw.length;
    const total = reviw.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalreviw > 0 ? total / reviw.length : 0;
    const rating = parseFloat(averageRating.toFixed(2));
    return rating;
}

module.exports = checkRating;
