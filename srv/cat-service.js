// const { exit } = require("@sap/cds")

module.exports = (srv) => {

    const {Books} = cds.entities ('my.bookshop')


    //  Reply mock data for Books...
//  srv.on ('READ', 'Books', ()=>[
//    { ID:201, title:'Wuthering Heights', author_ID:101, stock:12 },
//    { ID:251, title:'The Raven', author_ID:150, stock:333 },
//    { ID:252, title:'Eleonora', author_ID:150, stock:555 },
//    { ID:271, title:'Catweazle', author_ID:170, stock:222 },
//  ])

//  // Reply mock data for Authors...
//  srv.on ('READ', 'Authors', ()=>[
//    { ID:101, name:'Emily Brontë' },
//    { ID:150, name:'Edgar Allen Poe' },
//    { ID:170, name:'Richard Carpenter' },
//  ])





  // update
  srv.before ('CREATE', 'Orders', async (req) => {
    const order = req.data
    if (!order.amount || order.amount <= 0)  return req.error (400, 'Order at least 1 book')
    const tx = cds.transaction(req)
    const affectedRows = await tx.run (
      UPDATE (Books)
        .set   ({ stock: {'-=': order.amount}})
        .where ({ stock: {'>=': order.amount},/*and*/ ID: order.book_ID})
    )
    if (affectedRows === 0)  req.error (409, "Sold out, sorry")
  })


  //delete
  srv.on('DELETE', 'Books', async (req) => {
    const book_ID = req.data.ID
    if (book_ID === '') req.error(405, "Please enter a book id")
    const tx = cds.transaction(req)
    const affectedRows = await tx.run(
      DELETE.from(Books)
        .where({ ID: {'=':book_ID} })
    )
    if (affectedRows === 0) req.error(404, "Book not found")
  })

  
  //insert
  srv.before('CREATE', 'Orders', async (req) => {
    const newBook = req.data
    if (!newBook.ID || !newBook.title || !newBook.author_ID || !newBook.stock) {
      return req.error(400, 'All book details must be provided')
    }
    const tx = cds.transaction(req)
    await tx.run(
      INSERT.into(Books).entries(newBook)
    )
  })
  





  // Add some discount for overstocked books
  // each is a variable having all the response data from the database
  srv.after ('READ', 'Books', each => {
    if (each.stock > 111)  each.title += ' -- 11% discount!'
  })

}
