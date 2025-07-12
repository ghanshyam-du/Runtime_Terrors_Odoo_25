import SwapRequest from "../models/swapRequestModel.js";

export const createSwapRequest = async (req, res) => {
  try {
    const { requesterId, requesterName, targetId, targetName, message } = req.body;

    if (!requesterId || !targetId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const request = await SwapRequest.create({
      requesterId,
      requesterName,
      targetId,
      targetName,
      message,
    });

    res.status(201).json({ message: "Swap request sent", request });
  } catch (err) {
    console.error("❌ createSwapRequest error:", err);
    res.status(500).json({ error: "Server error creating request" });
  }
};

export const getSwapRequestsForUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await SwapRequest.findAll({
      where: { targetId: userId },
    });

    res.json({ requests });
  } catch (err) {
    console.error("❌ getSwapRequestsForUser error:", err);
    res.status(500).json({ error: "Server error fetching requests" });
  }
};