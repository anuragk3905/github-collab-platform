const permissionMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const repo = req.repo; // set by Person B
    const userId = req.user.id;

    let role = null;

    if (repo.owner.toString() === userId) {
      role = "owner";
    } else {
      const collaborator = repo.collaborators.find(
        (c) => c.userId.toString() === userId
      );
      role = collaborator ? collaborator.role : null;
    }

    if (!role)
      return res.status(403).json({ message: "Access denied" });

    if (requiredRole === "owner" && role !== "owner") {
      return res.status(403).json({ message: "Only owner allowed" });
    }

    next();
  };
};

export default permissionMiddleware;