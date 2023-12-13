/* 
Role ID:
1. Admin
2. User
*/

const authPage = (roles) => {
  return (req, res, next) => {
    const userRole = res.user.roleId;
    console.log(userRole);
    if (roles.includes(userRole)) {
      next();
    } else {
      return res.status(401).json("You don't have a permission");
    }
  };
};

module.exports = {
  authPage,
};
