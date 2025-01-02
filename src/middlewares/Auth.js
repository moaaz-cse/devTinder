//making the logic as a module/reusable
const adminAuth = (req, res, next) => {
  //Checking if user is Authorized as Admin or not.
  console.log("Doing admin authorization. ");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized admin access.");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  //Checking if user is Authorized as user or not.
  console.log("Doing user authorization. ");
  const token = "xyz";
  const isUserAuthorized = token === "xyz";
  if (!isUserAuthorized) {
    res.status(401).send("Unauthorized user access.");
  } else {
    next();
  }
};

module.exports = { adminAuth, userAuth };
