import Repository from "../models/Repository.js";

export const createRepo = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Repository name is required" });
    }

    const repo = await Repository.create({
      name,
      owner: req.user.id,
      collaborators: [
        {
          userId: req.user.id,
          role: "owner",
        },
      ],
    });
    res.status(201).json(repo);
  } catch (error) {
    console.error(error); // 👈 IMPORTANT (check terminal)
    res.status(500).json({ message: "Server Error" });
  }
};

export const getAllRepos = async (req, res) => {
  try {
    const repos = await Repository.find();

    res.status(200).json(repos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getRepoById = async (req, res) => {
  try {
    const { id } = req.params;

    const repo = await Repository.findById(id);

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.status(200).json(repo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteRepo = async (req, res) => {
  try {
    const { id } = req.params;

    const repo = await Repository.findById(id);

    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

  
    const userId = req.user.id;

    // Check if user is owner
    if (repo.owner.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await repo.deleteOne();

    res.status(200).json({ message: "Repository deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};