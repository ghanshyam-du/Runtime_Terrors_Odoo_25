import SwapRequest from "../models/swapRequestModel.js";

export const createSwapRequest = async (req, res) => {
  try {
    const {
      requesterId,
      requesterName,
      targetId,
      targetName,
      offeredSkill,
      wantedSkill, // <-- update this line
      message,
    } = req.body;
    // 🔒 Basic validation
    if (!requesterId || !targetId || !offeredSkill || !wantedSkill) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const request = await SwapRequest.create({
      requesterId,
      requesterName,
      targetId,
      targetName,
      offeredSkill,
      requestedSkill: wantedSkill, // ✅ use client field
      message,
      status: "pending",
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
      order: [["createdAt", "DESC"]],
    });

    res.json({ requests });
  } catch (err) {
    console.error("❌ getSwapRequestsForUser error:", err);
    res.status(500).json({ error: "Server error fetching requests" });
  }
};

// PATCH /swaps/:id
export const updateSwapStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["accepted", "rejected", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const swap = await SwapRequest.findByPk(id);
    if (!swap) {
      return res.status(404).json({ error: "Swap not found" });
    }

    swap.status = status;
    await swap.save();

    res.json({ message: "Swap status updated", swap });
  } catch (err) {
    console.error("❌ updateSwapStatus error:", err);
    res.status(500).json({ error: "Server error updating swap" });
  }
};
