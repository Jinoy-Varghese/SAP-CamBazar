const cds = require('@sap/cds');
const fs = require('fs');
const path = require('path');
const { Files } = cds.entities;

module.exports = (srv) => {

    const { Books } = cds.entities('my.bookshop');
    
    // File upload handler
    srv.on('upload', async (req) => {
        const { file } = req.data;
        if (!file) return req.error(400, 'No file provided');

        // Save the file to a folder (e.g., 'uploads')
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const filePath = path.join(uploadDir, file.name);
        fs.writeFileSync(filePath, file.content, 'base64');

        // Optionally, save file metadata to the database
        await INSERT.into(Files).entries({
            name: file.name,
            path: filePath,
            mimeType: file.mimeType,
            size: file.size
        });

        return { file_url: filePath };
    });

    // Update
    srv.before('CREATE', 'Orders', async (req) => {
        const order = req.data;
        if (!order.amount || order.amount <= 0) return req.error(400, 'Order at least 1 book');
        const tx = cds.transaction(req);
        const affectedRows = await tx.run(
            UPDATE(Books)
                .set({ stock: { '-=': order.amount } })
                .where({ stock: { '>=': order.amount }, ID: order.book_ID })
        );
        if (affectedRows === 0) req.error(409, "Sold out, sorry");
    });

    // Delete
    srv.on('DELETE', 'Books', async (req) => {
        const book_ID = req.data.ID;
        if (book_ID === '') req.error(405, "Please enter a book id");
        const tx = cds.transaction(req);
        const affectedRows = await tx.run(
            DELETE.from(Books)
                .where({ ID: { '=': book_ID } })
        );
        if (affectedRows === 0) req.error(404, "Book not found");
    });

    // Insert
    srv.before('CREATE', 'Orders', async (req) => {
        const newBook = req.data;
        if (!newBook.ID || !newBook.title || !newBook.author_ID || !newBook.stock) {
            return req.error(400, 'All book details must be provided');
        }
        const tx = cds.transaction(req);
        await tx.run(
            INSERT.into(Books).entries(newBook)
        );
    });

    // Add some discount for overstocked books
    // each is a variable having all the response data from the database
    // srv.after('READ', 'Books', each => {
    //     if (each.stock > 111) each.title += ' -- 11% discount!';
    // });
};
