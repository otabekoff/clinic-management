export default (err, req, res, next) => {
    console.error("ERROR DETAILS:");
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    console.error("Full Error:", err);

    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error"
    });
};
