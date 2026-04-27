const adminAuth = (req, res, next) => {
  console.log("Admin authorized checked successfully!");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz"; // Simulating admin authorization check
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized access!");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("User authorized checked successfully!");
  const token = "xyz";
  const isUserAuthorized = token === "xyz"; // Simulating user authorization check
  if (!isUserAuthorized) {
    res.status(401).send("Unauthorized access!");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
