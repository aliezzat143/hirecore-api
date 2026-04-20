const Gig = require('../models/gig');
const Order = require('../models/order');
const validateObjectId = require('../utils/validateObjectId');
const uploadToCloudinary = require('../utils/uploadToCloudinary');

// Create gig
exports.createGig = async (req, res) => {
    const { title, description, price, category } = req.body;

    if (!title || !description || !price || !category) {
        return res.status(400).json({ message: 'All fields required' });
    }

    if (price <= 0 || isNaN(price)) {
        return res.status(400).json({ message: 'Price must be a positive number' });
    }

    try {
        const imageUrls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(file.buffer, 'freelance/gig-pictures');
                imageUrls.push(result.secure_url);
            }
        }

        const gig = new Gig({
            title,
            description,
            price,
            category,
            images: imageUrls,
            userId: req.user.userId
        });

        await gig.save();
        res.status(201).json(gig);
    } catch (err) {
        console.error("Error creating gig:", err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all gigs with filters
exports.getGigs = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, page } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortOption = {};

    if (sort === "price_asc") sortOption.price = 1;
    if (sort === "price_desc") sortOption.price = -1;
    if (sort === "newest") sortOption.createdAt = -1;

    const pageNumber = Number(page) || 1;
    const limit = 10;
    const skip = (pageNumber - 1) * limit;

    const gigs = await Gig.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json(gigs);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single gig
exports.getGigById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: "Invalid gig ID" });
    }

    const gig = await Gig.findById(id)
      .populate("userId", "username email");

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    res.json(gig);

  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update gig
exports.updateGig = async (req, res) => {
    const { id } = req.params;

    if (!validateObjectId(id)) {
        return res.status(400).json({ message: "Invalid gig ID" });
    }

    try {
        const gig = await Gig.findById(id);
        if (!gig) {
            return res.status(404).json({ message: "Gig not found" });
        }

        if (gig.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You can only update your own gigs" });
        }

        const { title, description, price, category } = req.body;
        
        if (title !== undefined && (!title || title.trim() === "")) {
            return res.status(400).json({ message: "Title cannot be empty" });
        }

        if (description !== undefined && (!description || description.trim() === "")) {
            return res.status(400).json({ message: "Description cannot be empty" });
        }

        if (price !== undefined && (price <= 0 || isNaN(price))) {
            return res.status(400).json({ message: "Price must be a positive number" });
        }

        if (title) gig.title = title;
        if (description) gig.description = description;
        if (price) gig.price = price;
        if (category) gig.category = category;

        if (req.files && req.files.length > 0) {
            const imageUrls = [];
            for (const file of req.files) {
                const result = await uploadToCloudinary(file.buffer, 'freelance/gig-pictures');
                imageUrls.push(result.secure_url);
            }
            gig.images = imageUrls;
        }

        await gig.save();
        res.json({ message: "Gig updated successfully", gig });
    } catch (err) {
        console.error("Error updating gig:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete gig
exports.deleteGig = async (req, res) => {
    const { id } = req.params;

    if (!validateObjectId(id)) {
        return res.status(400).json({ message: "Invalid gig ID" });
    }

    try {
        const gig = await Gig.findById(id);
        if (!gig) {
            return res.status(404).json({ message: "Gig not found" });
        }

        if (gig.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "You can only delete your own gigs" });
        }

        const activeOrders = await Order.findOne({ 
            gigId: id, 
            status: { $in: ["pending", "in_progress"] }
        });
        if (activeOrders) {
            return res.status(400).json({ message: "Cannot delete gig with active orders" });
        }

        await Gig.findByIdAndDelete(id);
        res.json({ message: "Gig deleted successfully" });
    } catch (err) {
        console.error("Error deleting gig:", err);
        res.status(500).json({ message: "Server error" });
    }
};
