const checkProgress = (progressUser, moduleCourse) => {
    const currentProgress = progressUser.length;
    const progress = currentProgress / moduleCourse.length * 100;
    const checkProgress = progress > 0 ? progress : 0;
    const totalProgress = Math.ceil(parseFloat(checkProgress));
    return totalProgress;
}

module.exports = checkProgress;